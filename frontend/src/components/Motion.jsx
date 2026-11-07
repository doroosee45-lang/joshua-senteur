import React, { useEffect, useRef, useState } from 'react';

/**
 * Harmonized Scroll-Reveal Component (inspired by La Roselle Atelier)
 * Smoothly reveals text, cards, and editorial blocks with a unified cubic-bezier curve.
 */
export function Reveal({
  children,
  className = '',
  delay = 0,
  variant = 'up', // 'up' | 'fade' | 'scale'
  threshold = 0.12,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin: '0px 0px -36px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, visible]);

  const hiddenTransform =
    variant === 'scale'
      ? 'opacity-0 scale-[0.96] translate-y-3'
      : variant === 'fade'
      ? 'opacity-0'
      : 'opacity-0 translate-y-6';

  const visibleTransform = 'opacity-100 scale-100 translate-y-0';

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: '900ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`transition-all will-change-[transform,opacity] ${
        visible ? visibleTransform : hiddenTransform
      } ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Modern Architectural Luxury Image Component
 * - Soft warm travertine/espresso placeholder while loading
 * - Smooth blur-to-sharp progressive fade & subtle scale settle
 * - Optional secondary hover angle crossfade
 * - Unified subtle editorial tonal finish so all imagery feels harmonized
 */
export function LuxuryImage({
  src,
  hoverSrc,
  alt = '',
  className = '',
  imgClassName = '',
  darkPlaceholder = false,
  zoomOnHover = true,
  toneOverlay = true,
}) {
  const [loaded, setLoaded] = useState(false);
  const hasDistinctHover = hoverSrc && hoverSrc !== src;

  return (
    <div
      className={`relative overflow-hidden ${
        darkPlaceholder ? 'bg-[#241C1A]' : 'bg-[#EFE8E1]'
      } ${className}`}
    >
      {/* Primary Photo */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`w-full h-full object-cover transition-all duration-[950ms] ${
          loaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-[1.045] blur-[8px]'
        } ${
          hasDistinctHover
            ? 'group-hover:opacity-0 group-hover:scale-[1.04]'
            : zoomOnHover
            ? 'group-hover:scale-[1.045]'
            : ''
        } ${imgClassName}`}
      />

      {/* Optional Hover Secondary Angle */}
      {hasDistinctHover && (
        <img
          src={hoverSrc}
          alt={alt ? `${alt} — vue secondaire` : ''}
          loading="lazy"
          style={{
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="absolute inset-0 w-full h-full object-cover opacity-0 scale-[1.02] group-hover:opacity-100 group-hover:scale-[1.05] transition-all duration-[950ms]"
        />
      )}

      {/* Unified Subtle Warm Haute-Parfumerie Tonal Finish */}
      {toneOverlay && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1C1615]/[0.08] via-transparent to-[#FAF7F4]/[0.03]"
        />
      )}
    </div>
  );
}

/**
 * Harmonized Editorial Section Header
 * Enforces identical typographic rhythm across every page of Joshua Parfum.
 */
export function EditorialHeader({
  eyebrow,
  title,
  italicAccent,
  description,
  align = 'center', // 'center' | 'left'
  theme = 'light', // 'light' (on warm ivory) | 'dark' (on espresso)
  className = '',
}) {
  const isCentered = align === 'center';
  const isDark = theme === 'dark';

  return (
    <Reveal
      className={`${
        isCentered ? 'text-center max-w-2xl mx-auto' : 'text-left max-w-xl'
      } ${className}`}
    >
      {eyebrow && (
        <div
          className={`inline-flex items-center gap-3 mb-3.5 ${
            isCentered ? 'justify-center' : 'justify-start'
          }`}
        >
          <span
            className={`w-6 h-[1px] ${
              isDark ? 'bg-[#E2C0BC]/55' : 'bg-[#8A5A5A]/45'
            }`}
          />
          <span
            className={`text-[10px] sm:text-[10.5px] uppercase tracking-[0.32em] font-medium ${
              isDark ? 'text-[#E2C0BC]' : 'text-[#8A5A5A]'
            }`}
          >
            {eyebrow}
          </span>
          {isCentered && (
            <span
              className={`w-6 h-[1px] ${
                isDark ? 'bg-[#E2C0BC]/55' : 'bg-[#8A5A5A]/45'
              }`}
            />
          )}
        </div>
      )}

      <h2
        className={`font-serif text-3xl sm:text-5xl lg:text-[52px] font-normal leading-[1.08] tracking-[-0.01em] ${
          isDark ? 'text-[#FAF7F4]' : 'text-[#1C1615]'
        }`}
      >
        {title}{' '}
        {italicAccent && (
          <em
            className={`italic font-light ${
              isDark ? 'text-[#E2C0BC]' : 'text-[#8A5A5A]'
            }`}
          >
            {italicAccent}
          </em>
        )}
      </h2>

      {description && (
        <p
          className={`mt-4 text-xs sm:text-[13.5px] font-light leading-[1.8] ${
            isDark ? 'text-[#FAF7F4]/72' : 'text-[#5C4F4C]'
          }`}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
