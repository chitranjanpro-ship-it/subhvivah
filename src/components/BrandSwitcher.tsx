"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type BrandVariant = "en" | "hi";

const BRAND_CONTENT: Record<BrandVariant, { label: string; imageSrc: string; fallbackGlyph: string }> = {
  en: {
    label: "SubhVivah",
    imageSrc: "/logo.png",
    fallbackGlyph: "SV",
  },
  hi: {
    label: "शुभविवाह",
    imageSrc: "/logo-hindi.png",
    fallbackGlyph: "शु",
  },
};

function buildFallbackLogo(glyph: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f59e0b" />
          <stop offset="100%" stop-color="#b91c1c" />
        </linearGradient>
      </defs>
      <rect width="96" height="96" rx="48" fill="url(#g)" />
      <text x="48" y="56" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="#fff7ed">${glyph}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

interface BrandSwitcherProps {
  testId: string;
  className?: string;
  textClassName?: string;
  iconClassName?: string;
  intervalMs?: number;
}

export function BrandSwitcher({
  testId,
  className = "",
  textClassName = "",
  iconClassName = "",
  intervalMs = 4000,
}: BrandSwitcherProps) {
  const [variant, setVariant] = useState<BrandVariant>("en");
  const [failedImages, setFailedImages] = useState<Record<BrandVariant, boolean>>({
    en: false,
    hi: false,
  });

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setVariant((current) => (current === "en" ? "hi" : "en"));
    }, intervalMs);

    return () => window.clearInterval(intervalId);
  }, [intervalMs]);

  const imageSources = useMemo(
    () => ({
      en: failedImages.en ? buildFallbackLogo(BRAND_CONTENT.en.fallbackGlyph) : BRAND_CONTENT.en.imageSrc,
      hi: failedImages.hi ? buildFallbackLogo(BRAND_CONTENT.hi.fallbackGlyph) : BRAND_CONTENT.hi.imageSrc,
    }),
    [failedImages],
  );

  return (
    <Link
      href="/"
      aria-label="SubhVivah Home"
      data-testid={testId}
      data-brand-variant={variant}
      className={`inline-flex items-center gap-2 sm:gap-3 ${className}`}
    >
      <div className={`relative h-10 w-10 sm:h-11 sm:w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-primary/10 ${iconClassName}`}>
        {(["en", "hi"] as BrandVariant[]).map((key) => (
          <img
            key={key}
            src={imageSources[key]}
            alt={BRAND_CONTENT[key].label}
            onError={() => setFailedImages((current) => ({ ...current, [key]: true }))}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${variant === key ? "opacity-100" : "opacity-0"}`}
          />
        ))}
      </div>

      <span className={`relative block h-7 min-w-[7rem] sm:min-w-[9rem] text-left ${textClassName}`}>
        {(["en", "hi"] as BrandVariant[]).map((key) => (
          <span
            key={key}
            className={`absolute left-0 top-0 whitespace-nowrap transition-all duration-700 ${variant === key ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}
          >
            {BRAND_CONTENT[key].label}
          </span>
        ))}
      </span>
    </Link>
  );
}
