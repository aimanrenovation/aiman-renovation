'use client';

import { SCENE_MAP } from './scenes/sceneMap';
import ScrollScene from './ScrollScene';
import GPUFallback from './GPUFallback';
import useGPUDetect from './hooks/useGPUDetect';

interface ServiceSceneProps {
  slug: string;
}

export default function ServiceScene({ slug }: ServiceSceneProps) {
  const config = SCENE_MAP[slug];
  const { isLowEnd } = useGPUDetect();

  if (!config) {
    return null;
  }

  if (isLowEnd) {
    return (
      <GPUFallback
        title={config.title}
        ruinLabel={config.ruinLabel}
        renovatedLabel={config.renovatedLabel}
        fallbackImage={config.fallbackImage}
      />
    );
  }

  const SceneComponent = config.component;

  return (
    <section className="relative" aria-label={`Transformation 3D : ${config.title}`}>
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-center">
        <p className="text-white/80 text-lg font-semibold mb-1">
          {config.title}
        </p>
        <p className="text-white/50 text-sm">
          Scrollez pour voir la transformation
        </p>
        <div className="mt-3 w-6 h-10 border-2 border-white/30 rounded-full mx-auto flex justify-center">
          <div className="w-1.5 h-3 bg-[#E50000] rounded-full mt-1.5 animate-bounce" />
        </div>
      </div>

      <div className="absolute top-20 left-6 z-10 pointer-events-none">
        <p className="text-white/40 text-xs font-mono uppercase tracking-wider">{config.ruinLabel}</p>
      </div>
      <div className="absolute top-20 right-6 z-10 pointer-events-none">
        <p className="text-white/40 text-xs font-mono uppercase tracking-wider">{config.renovatedLabel}</p>
      </div>

      <ScrollScene
        scrollHeight="300vh"
        canvasHeight="100vh"
        id={`service-${slug}`}
      >
        {(progress) => <SceneComponent progress={progress} />}
      </ScrollScene>
    </section>
  );
}
