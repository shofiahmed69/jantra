"use client";

import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";

const animationCache = new Map<string, unknown>();

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

        fetch(src, { signal: controller.signal })
            .then((res) => res.json())
            .then((data) => {
                const normalized = normalizeLottieAssetPaths(data, src);
                animationCache.set(src, normalized);
                setAnimationState({ src, data: normalized });
            })
            .catch((err: unknown) => {
                if (err instanceof DOMException && err.name === "AbortError") {
                    return;
                }

            });

        return () => controller.abort();
    }, [shouldLoad, src]);

    if (!animationData) {
        return (
            <div ref={containerRef} className={`flex items-center justify-center ${className}`}>
                <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
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
