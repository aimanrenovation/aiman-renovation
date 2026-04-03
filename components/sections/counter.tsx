"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export function Counter({ value, prefix = "", suffix = "", label }: CounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const num = numRef.current;
    if (!el || !num) return;

    const obj = { val: 0 };

    gsap.to(obj, {
      val: value,
      duration: 2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none reset",
      },
      onUpdate: () => {
        num.textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [value, prefix, suffix]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-heading text-4xl md:text-6xl text-[#E50000]">
        <span ref={numRef}>{prefix}0{suffix}</span>
      </div>
      <div className="text-sm md:text-base text-gray-400 mt-2">{label}</div>
    </div>
  );
}
