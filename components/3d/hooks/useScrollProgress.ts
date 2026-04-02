'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface UseScrollProgressOptions {
  triggerId: string;
  start?: string;
  end?: string;
  pin?: boolean;
}

export default function useScrollProgress({
  triggerId,
  start = 'top top',
  end = 'bottom top',
  pin = false,
}: UseScrollProgressOptions) {
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const trigger = document.getElementById(triggerId);
    if (!trigger) return;

    const st = ScrollTrigger.create({
      trigger,
      start,
      end,
      pin,
      scrub: 0.5,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        setProgress(self.progress);
      },
    });

    return () => {
      st.kill();
    };
  }, [triggerId, start, end, pin]);

  return { progress, progressRef };
}
