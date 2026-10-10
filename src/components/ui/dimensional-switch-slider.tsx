"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { flushSync } from "react-dom";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(CustomEase);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type SlideItem = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
};

type CSSLength = string | number;

const ITEMS: SlideItem[] = [
  { id: 1, title: "Dimensional Switch",  subtitle: "Interactive 3-D card flip", image: "" },
  { id: 2, title: "Hyperiux Vault",      subtitle: "Premium component library", image: "" },
  { id: 3, title: "Motion Systems",      subtitle: "GSAP-powered animations",   image: "" },
  { id: 4, title: "Interaction Design",  subtitle: "Tactile UI patterns",       image: "" },
  { id: 5, title: "Source-First",        subtitle: "Own every line of code",    image: "" },
];

const DEFAULT_EASE = "M0,0 C0.075,0.82 0.165,1 1,1";
const EASE     = "power4.inOut";
const DURATION = 0.9;
const TEXT_Z   = 60;

const resolveEase = (ease: string): string => {
  if (ease.startsWith("M")) {
    const id = `custom_${ease.slice(0, 12).replace(/[^a-z0-9]/gi, "")}`;
    CustomEase.create(id, ease);
    return id;
  }
  return ease;
};

const toCssLength = (v: CSSLength): string =>
  typeof v === "number" ? `${v}px` : v;

interface DimensionalSwitchSliderProps {
  items?:            SlideItem[];
  infinite?:         boolean;
  ease?:             string;
  textColor?:        string;
  cardWidth?:        CSSLength;
  cardHeight?:       CSSLength;
  direction?:        "horizontal" | "vertical";
  textSize?:         CSSLength;
  cardBorderRadius?: CSSLength;
  autoplay?:         boolean;
  autoplayDelay?:    number;
}

export default function DimensionalSwitchSlider({
  items            = ITEMS,
  infinite         = true,
  ease             = DEFAULT_EASE,
  textColor        = "#ffffff",
  cardWidth        = 680,
  cardHeight       = 420,
  direction        = "horizontal",
  textSize         = 84,
  cardBorderRadius = 24,
  autoplay         = false,
  autoplayDelay    = 2600,
}: DimensionalSwitchSliderProps) {
  const total = items.length;

  const frontRef     = useRef<HTMLDivElement>(null);
  const backRef      = useRef<HTMLDivElement>(null);
  const frontTextRef = useRef<HTMLDivElement>(null);
  const backTextRef  = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const frontIndexRef = useRef(0);
  const backIndexRef  = useRef(1 % total);
  const currentIndex  = useRef(0);
  const isAnimating   = useRef(false);

  const [displayIndex, setDisplayIndex] = useState(0);
  const resolvedEase = resolveEase(ease);

  useEffect(() => {
    if (frontRef.current) gsap.set(frontRef.current, { zIndex: 2 });
    if (backRef.current)  gsap.set(backRef.current,  { zIndex: 1 });
  }, []);

  useEffect(() => {
    frontIndexRef.current = 0;
    backIndexRef.current  = 1 % total;
    currentIndex.current  = 0;
    setDisplayIndex(0);
    if (frontRef.current) {
      gsap.set(frontRef.current, { rotateX: 0, rotateY: 0, zIndex: 2 });
    }
    if (backRef.current) {
      gsap.set(backRef.current, {
        rotateX: direction === "vertical" ? -90 : 0,
        rotateY: direction === "horizontal" ? 90 : 0,
        zIndex: 1,
      });
    }
  }, [direction, total]);

  const flipTo = useCallback(
    (targetIndex: number) => {
      if (isAnimating.current) return;
      if (!infinite && targetIndex < 0) return;
      if (!infinite && targetIndex >= total) return;

      const next = ((targetIndex % total) + total) % total;
      isAnimating.current  = true;
      backIndexRef.current = next;

      const front     = frontRef.current!;
      const back      = backRef.current!;
      const frontText = frontTextRef.current!;
      const backText  = backTextRef.current!;
      const isH       = direction === "horizontal";

      gsap.set(back, {
        rotateX: isH ? 0 : -90,
        rotateY: isH ? 90 : 0,
        zIndex: 1,
      });

      const tl = gsap.timeline({
        onComplete: () => {
          flushSync(() => setDisplayIndex(next));
          frontIndexRef.current = next;
          currentIndex.current  = next;

          gsap.set(front, {
            rotateX: isH ? 0 : -90,
            rotateY: isH ? 90 : 0,
            zIndex: 1,
          });
          gsap.set(back, { rotateX: 0, rotateY: 0, zIndex: 2 });

          (frontRef as React.MutableRefObject<HTMLDivElement | null>).current = back;
          (backRef  as React.MutableRefObject<HTMLDivElement | null>).current = front;
          (frontTextRef as React.MutableRefObject<HTMLDivElement | null>).current = backText;
          (backTextRef  as React.MutableRefObject<HTMLDivElement | null>).current = frontText;

          isAnimating.current = false;
        },
      });

      if (!prefersReducedMotion()) {
        tl.to(front, { rotateX: isH ? 0 : 90,  rotateY: isH ? -90 : 0, duration: DURATION, ease: resolvedEase }, 0)
          .to(back,  { rotateX: 0, rotateY: 0,                          duration: DURATION, ease: resolvedEase }, 0)
          .to(frontText, { z: -TEXT_Z, opacity: 0, duration: DURATION * 0.5, ease: EASE }, 0)
          .to(backText,  { z: TEXT_Z,  opacity: 1, duration: DURATION * 0.5, ease: EASE, delay: DURATION * 0.5 }, 0);
      } else {
        tl.set(front, { rotateX: isH ? 0 : 90,  rotateY: isH ? -90 : 0 })
          .set(back,  { rotateX: 0, rotateY: 0 });
      }
    },
    [direction, infinite, total, resolvedEase]
  );

  const switchTo = useCallback(
    (dir: "prev" | "next") => flipTo(currentIndex.current + (dir === "next" ? 1 : -1)),
    [flipTo]
  );

  const goToIndex = useCallback((idx: number) => flipTo(idx), [flipTo]);

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => switchTo("next"), autoplayDelay);
    return () => clearInterval(id);
  }, [autoplay, autoplayDelay, switchTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") switchTo("next");
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   switchTo("prev");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [switchTo]);

  const w  = toCssLength(cardWidth);
  const h  = toCssLength(cardHeight);
  const r  = toCssLength(cardBorderRadius);
  const fs = toCssLength(textSize);

  const cardStyle: React.CSSProperties = {
    width: w, height: h, borderRadius: r,
    position: "absolute", inset: 0,
    backfaceVisibility: "hidden",
    overflow: "hidden",
  };

  const overlayStyle: React.CSSProperties = {
    position: "absolute", inset: 0,
    background: "linear-gradient(to top, oklch(10% 0 0 / 0.7) 0%, transparent 60%)",
  };

  const textStyle: React.CSSProperties = {
    position: "absolute", inset: 0,
    display: "flex", flexDirection: "column",
    justifyContent: "flex-end",
    padding: "2rem",
    color: textColor,
    zIndex: 10,
  };

  const renderCard = (
    ref: React.RefObject<HTMLDivElement>,
    textRef: React.RefObject<HTMLDivElement>,
    index: number,
    extraTextStyle?: React.CSSProperties
  ) => (
    <div ref={ref} style={{ ...cardStyle, transformStyle: "preserve-3d" }}>
      {items[index]?.image ? (
        <img
          src={items[index].image}
          alt={items[index].title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <div style={{
          width: "100%", height: "100%",
          background: `oklch(35% 0.12 ${(index * 60) % 360})`,
        }} />
      )}
      <div style={overlayStyle} />
      <div ref={textRef} style={{ ...textStyle, ...extraTextStyle }}>
        <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.7, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {items[index]?.subtitle}
        </p>
        <h2 style={{ margin: "0.25rem 0 0", fontSize: fs, fontWeight: 700, lineHeight: 1.05 }}>
          {items[index]?.title}
        </h2>
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", userSelect: "none" }}
    >
      <div style={{ width: w, height: h, position: "relative", perspective: "1200px" }}>
        {renderCard(frontRef as React.RefObject<HTMLDivElement>, frontTextRef as React.RefObject<HTMLDivElement>, frontIndexRef.current)}
        {renderCard(backRef  as React.RefObject<HTMLDivElement>, backTextRef  as React.RefObject<HTMLDivElement>, backIndexRef.current,  { opacity: 0 })}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button onClick={() => switchTo("prev")} aria-label="Previous slide" style={btnStyle}>
          <ChevronLeft size={20} />
        </button>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goToIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: displayIndex === i ? "1.75rem" : "0.5rem",
                height: "0.5rem",
                borderRadius: "9999px",
                border: "none",
                cursor: "pointer",
                transition: "width 0.3s ease, background 0.3s ease",
                background: displayIndex === i ? "oklch(70% 0.18 260)" : "oklch(50% 0 0 / 0.4)",
                padding: 0,
              }}
            />
          ))}
        </div>

        <button onClick={() => switchTo("next")} aria-label="Next slide" style={btnStyle}>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "2.5rem",
  height: "2.5rem",
  borderRadius: "50%",
  border: "1px solid oklch(50% 0 0 / 0.3)",
  background: "oklch(20% 0 0 / 0.6)",
  color: "#fff",
  cursor: "pointer",
  backdropFilter: "blur(8px)",
  transition: "background 0.2s ease",
};
