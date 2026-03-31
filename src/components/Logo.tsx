"use client";

import React from "react";

export default function Logo({
    className = "w-8 h-8"
}: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <g fill="#F97316">
                {/* Main J body */}
                <path d="M42,15 H85 V85 H55 V70 H70 V30 H52 Z" />
                {/* Hook/Left part */}
                <path d="M25,65 H45 V85 H25 Z" />
            </g>
            {/* Signal Arrow Cut (White) */}
            <polygon points="30,90 75,35 55,75 40,90" fill="black" />
        </svg>
    )
}
