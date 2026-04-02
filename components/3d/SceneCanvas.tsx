'use client';

import { Suspense, useRef, useEffect, useState, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import SceneLoader from './SceneLoader';

interface SceneCanvasProps {
  children: ReactNode;
  className?: string;
  height?: string;
  bgColor?: string;
  id?: string;
}

export default function SceneCanvas({
  children,
  className = '',
  height = '100vh',
  bgColor = '#0A0A0A',
  id,
}: SceneCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      id={id}
      className={`relative w-full ${className}`}
      style={{ height }}
    >
      {isVisible ? (
        <Canvas
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 1.5]}
          camera={{ position: [0, 2, 5], fov: 50 }}
          style={{ background: bgColor }}
        >
          <Suspense fallback={<SceneLoader />}>
            {children}
          </Suspense>
        </Canvas>
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <div className="w-8 h-8 border-2 border-[#E50000] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
