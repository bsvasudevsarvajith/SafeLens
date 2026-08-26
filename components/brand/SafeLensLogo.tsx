"use client";

import React from "react";
import Link from "next/link";

interface SafeLensLogoProps {
  variant?: "full" | "icon" | "mobile" | "badge";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
}

export default function SafeLensLogo({
  variant = "full",
  size = "md",
  href = "/",
  className = "",
}: SafeLensLogoProps) {
  const sizeClasses = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
  };

  const textClasses = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
  };

  const LogoIcon = () => (
    <div
      className={`relative ${sizeClasses[size]} rounded-2xl bg-gradient-to-tr from-brand-purple via-[#7C3AED] to-brand-violet p-0.5 shadow-md flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}
    >
      {/* Outer Glow / Lens ring */}
      <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-[14px] flex items-center justify-center relative overflow-hidden">
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5/6 h-5/6 text-white"
        >
          {/* Shield Base */}
          <path
            d="M16 3L6 7V14C6 20.5 10.3 26.5 16 29C21.7 26.5 26 20.5 26 14V7L16 3Z"
            fill="currentColor"
            fillOpacity="0.2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Lens / Eye Core */}
          <ellipse
            cx="16"
            cy="15"
            rx="5.5"
            ry="4"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          {/* Center Iris / Location Pin Point */}
          <circle
            cx="16"
            cy="15"
            r="2"
            fill="currentColor"
          />
          {/* Top Pin Notch Indicator */}
          <circle
            cx="16"
            cy="9"
            r="1"
            fill="#F3EEFF"
          />
        </svg>
      </div>
    </div>
  );

  const LogoContent = () => {
    if (variant === "icon") {
      return <LogoIcon />;
    }

    if (variant === "mobile") {
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          <LogoIcon />
          <div className="flex flex-col">
            <span className={`font-extrabold tracking-tight text-brand-navy ${textClasses[size]} leading-none`}>
              SafeLens<span className="text-brand-purple">.ai</span>
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className={`flex items-center gap-3 ${className} group`}>
        <LogoIcon />
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold tracking-tight text-brand-navy ${textClasses[size]} leading-tight`}>
              SafeLens<span className="text-brand-purple"> AI</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-light text-brand-purple px-1.5 py-0.5 rounded-full border border-brand-purple/20">
              PRO
            </span>
          </div>
          <span className="text-[9px] font-semibold uppercase tracking-widest text-brand-muted">
            AI SAFETY INTELLIGENCE
          </span>
        </div>
      </div>
    );
  };

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none">
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
}
