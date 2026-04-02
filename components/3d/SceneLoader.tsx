'use client';

import { useProgress, Html } from '@react-three/drei';

export default function SceneLoader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#E50000] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-white/60 text-sm font-mono">
          {progress.toFixed(0)}%
        </p>
      </div>
    </Html>
  );
}
