'use client';

import { HERO_SCENES, SCENE_MAP } from './scenes/sceneMap';
import ScrollScene from './ScrollScene';
import GPUFallback from './GPUFallback';
import useGPUDetect from './hooks/useGPUDetect';

export default function HeroScenes() {
  const { isLowEnd } = useGPUDetect();

  if (isLowEnd) {
    return (
      <div className="space-y-0">
        {HERO_SCENES.map((slug) => {
          const config = SCENE_MAP[slug];
          return (
            <GPUFallback
              key={slug}
              title={config.title}
              ruinLabel={config.ruinLabel}
              renovatedLabel={config.renovatedLabel}
              fallbackImage={config.fallbackImage}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {HERO_SCENES.map((slug) => {
        const config = SCENE_MAP[slug];
        const SceneComponent = config.component;

        return (
          <section key={slug} className="relative">
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
              <p className="text-white/60 text-sm font-mono">{config.ruinLabel}</p>
            </div>
            <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
              <p className="text-white/60 text-sm font-mono">{config.renovatedLabel}</p>
            </div>

            <ScrollScene
              scrollHeight="200vh"
              canvasHeight="100vh"
              id={`hero-${slug}`}
            >
              {(progress) => <SceneComponent progress={progress} />}
            </ScrollScene>
          </section>
        );
      })}
    </div>
  );
}
