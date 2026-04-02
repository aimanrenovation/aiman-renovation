'use client';

import { useId, ReactNode, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import SceneCanvas from './SceneCanvas';
import useScrollProgress from './hooks/useScrollProgress';

interface ScrollSceneProps {
  children: (progress: number) => ReactNode;
  scrollHeight?: string;
  canvasHeight?: string;
  className?: string;
  id?: string;
}

export default function ScrollScene({
  children,
  scrollHeight = '300vh',
  canvasHeight = '100vh',
  className = '',
  id,
}: ScrollSceneProps) {
  const autoId = useId();
  const sceneId = id || `scene-${autoId}`;

  return (
    <div
      id={sceneId}
      className={`relative ${className}`}
      style={{ height: scrollHeight }}
    >
      <div className="sticky top-0" style={{ height: canvasHeight }}>
        <SceneCanvas height={canvasHeight} id={`${sceneId}-canvas`}>
          <ScrollSceneInner triggerId={sceneId}>
            {children}
          </ScrollSceneInner>
        </SceneCanvas>
      </div>
    </div>
  );
}

interface ScrollSceneInnerProps {
  triggerId: string;
  children: (progress: number) => ReactNode;
}

function ScrollSceneInner({ triggerId, children }: ScrollSceneInnerProps) {
  const { progressRef } = useScrollProgress({
    triggerId,
    start: 'top top',
    end: 'bottom bottom',
  });

  const [renderProgress, setRenderProgress] = useState(0);

  useFrame(() => {
    if (Math.abs(progressRef.current - renderProgress) > 0.001) {
      setRenderProgress(progressRef.current);
    }
  });

  return <>{children(renderProgress)}</>;
}
