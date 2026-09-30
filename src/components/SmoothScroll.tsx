"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

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
        // Only prevent if element is inside an active modal dialog
        const modalEl = node.closest?.("[role='dialog'], .modal-body");
        if (modalEl) {
          return true;
        }
        return false;
      },
    });

    lenisRef.current = lenis;
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
      lenisRef.current = null;
      delete (window as any).__lenis;
    };
  }, []);

  // Guarantee scroll to top (Hero section) on every route navigation unless hash anchor is present
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!window.location.hash) {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { immediate: true });
        }
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    }
  }, [pathname]);

  return null;
}
