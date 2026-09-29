"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Layered hand-off between two scenes: the first section pins once its content has
 * been read, and the next one scrolls up over it. No pin spacing is added — the pin
 * lasts exactly as long as the next scene takes to cover the viewport (≤ 1 screen),
 * so page length is unchanged and the release is seamless.
 *
 * Expects exactly two section children: [pinned scene, incoming scene].
 */
export default function SceneStack({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const [back, front] = Array.from(el.children) as HTMLElement[];
    if (!back || !front) return;
    const backContent = back.firstElementChild as HTMLElement | null;

    const mm = gsap.matchMedia(el);
    mm.add({ motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
      const vh = () => window.innerHeight;
      // pin once the whole back scene has been seen (tall on most screens), else at the top
      const start = () => (back.offsetHeight > vh() ? "bottom bottom" : "top top");
      const end = () => `+=${Math.min(front.offsetHeight, vh())}`;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: back, start, end, pin: true, pinSpacing: false, scrub: true, invalidateOnRefresh: true },
      });
      if (ctx.conditions?.reduce) return;

      // back scene recedes while it is covered
      if (backContent) tl.to(backContent, { scale: 0.95, opacity: 0.35, transformOrigin: "50% 100%", ease: "none" }, 0);

      // front scene settles as it rises into place
      gsap.fromTo(
        front,
        { scale: 0.98, opacity: 0.9 },
        {
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: front, start: "top bottom", end: () => `top ${Math.max(0, vh() - front.offsetHeight)}px`, scrub: true, invalidateOnRefresh: true },
        }
      );
    });
    return () => mm.revert();
  }, []);

  return <div ref={root}>{children}</div>;
}
