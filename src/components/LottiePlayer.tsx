"use client";

import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";

export const animationCache = new Map<string, unknown>();

interface LottiePlayerProps {
    src: string;
    className?: string;
    loop?: boolean;
    autoplay?: boolean;
    priority?: boolean;
}

interface AnimationState {
    src: string;
    data: unknown;
}

function resolveLottieAssetBase(src: string) {
    if (src.includes("/animations/")) {
        return src.replace(/\/animations\/[^/]+$/, "/images/");
    }

    const lastSlashIndex = src.lastIndexOf("/");
    if (lastSlashIndex === -1) {
        return "/";
    }

    return `${src.slice(0, lastSlashIndex + 1)}`;
}

function normalizeLottieAssetPaths(raw: unknown, src: string) {
    if (!raw || typeof raw !== "object") {
        return raw;
    }

    const animation = structuredClone(raw) as { assets?: Array<{ p?: string; u?: string }> };

    if (!Array.isArray(animation.assets)) {
        return animation;
    }

    const assetBase = resolveLottieAssetBase(src);

    animation.assets = animation.assets.map((asset) => {
        if (!asset || typeof asset !== "object" || typeof asset.p !== "string") {
            return asset;
        }

        const isAbsolute =
            asset.p.startsWith("/") ||
            asset.p.startsWith("http://") ||
            asset.p.startsWith("https://") ||
            asset.p.startsWith("data:");

        if (isAbsolute) {
            return asset;
        }

        return {
            ...asset,
            p: `${assetBase}${asset.p}`,
            u: "",
        };
    });

    return animation;
}

export default function LottiePlayer({
    src,
    className = "",
    loop = true,
    autoplay = true,
    priority = false,
}: LottiePlayerProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [animationState, setAnimationState] = useState<AnimationState | null>(null);
    const [shouldLoad, setShouldLoad] = useState(priority);
    const canObserve = !priority && typeof IntersectionObserver !== "undefined";
    const cachedAnimationData = animationCache.get(src) ?? null;
    const animationData = cachedAnimationData ?? (animationState?.src === src ? animationState.data : null);

    useEffect(() => {
        if (!canObserve || shouldLoad) {
            return;
        }

        const node = containerRef.current;
        if (!node) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) {
                    setShouldLoad(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "240px 0px" },
        );

        observer.observe(node);

        return () => observer.disconnect();
    }, [canObserve, shouldLoad]);

    useEffect(() => {
        if (!shouldLoad) {
            return;
        }

        if (animationCache.has(src)) {
            return;
        }

        const controller = new AbortController();

        const timer = setTimeout(() => {
            controller.abort();
        }, 8000);

        fetch(src, { signal: controller.signal })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load animation");
                return res.json();
            })
            .then((data) => {
                clearTimeout(timer);
                const normalized = normalizeLottieAssetPaths(data, src);
                animationCache.set(src, normalized);
                setAnimationState({ src, data: normalized });
            })
            .catch((err: unknown) => {
                clearTimeout(timer);
                if (err instanceof DOMException && err.name === "AbortError") {
                    return;
                }
                // Cache a null placeholder so we do not spam failing requests
                animationCache.set(src, null);
            });

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [shouldLoad, src]);

    if (!animationData) {
        return (
            <div ref={containerRef} className={`flex items-center justify-center relative overflow-hidden ${className}`}>
                <div className="w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-orange-500 shadow-sm animate-pulse">
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 2 7 12 12 22 7 12 2" />
                            <polyline points="2 17 12 22 22 17" />
                            <polyline points="2 12 12 17 22 12" />
                        </svg>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className={className}>
            <Lottie
                animationData={animationData}
                loop={loop}
                autoplay={autoplay}
                className="h-full w-full"
            />
        </div>
    );
}

export function preloadLottie(src: string) {
    if (animationCache.has(src)) return;
    fetch(src)
        .then((res) => res.json())
        .then((data) => {
            const normalized = normalizeLottieAssetPaths(data, src);
            animationCache.set(src, normalized);
        })
        .catch(() => {});
}
