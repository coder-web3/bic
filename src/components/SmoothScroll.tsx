"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    // Respect reduced motion preferences
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      infinite: false,
      prevent: (node: any) => {
        if (!node || typeof node.closest !== "function") return false;
        const tagName = node.tagName?.toLowerCase();
        if (tagName === "textarea" || tagName === "input" || tagName === "select") {
          return true;
        }
        return (
          node.hasAttribute?.("data-lenis-prevent") ||
          node.closest?.("[data-lenis-prevent]") !== null ||
          node.classList?.contains?.("lenis-prevent") ||
          node.closest?.(".lenis-prevent") !== null ||
          node.closest?.(".custom-scrollbar") !== null
        );
      },
    });

    // Make lenis instance available globally if needed for scroll-to triggers
    (window as any).__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as any).__lenis;
    };
  }, []);

  return null;
}
