"use client";

import React from "react";

export default function Logo({
    className = "w-8 h-8"
}: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 120"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Geometric J with arrow cut */}
            {/* Top horizontal bar */}
            <rect x="15" y="8" width="70" height="18"
                fill="#F97316" rx="2" />
            {/* Right vertical stem */}
            <rect x="67" y="8" width="18" height="80"
                fill="#F97316" rx="2" />
            {/* Bottom curve left */}
            <rect x="15" y="88" width="70" height="18"
                fill="#F97316" rx="2" />
            {/* Left small piece */}
            <rect x="15" y="70" width="18" height="36"
                fill="#F97316" rx="2" />
            {/* Arrow/slash cut - white diagonal */}
            <polygon
                points="20,35 42,35 72,85 50,85"
                fill="white" />
        </svg>
    )
}
