'use client';

import Image from 'next/image';

interface GPUFallbackProps {
  title: string;
  ruinLabel: string;
  renovatedLabel: string;
  fallbackImage: string;
}

export default function GPUFallback({
  title,
  ruinLabel,
  renovatedLabel,
  fallbackImage,
}: GPUFallbackProps) {
  return (
    <div className="relative w-full h-[70vh] bg-[#0A0A0A] flex items-center justify-center overflow-hidden">
      <Image
        src={fallbackImage}
        alt={`${title} — ${ruinLabel} vers ${renovatedLabel}`}
        fill
        className="object-cover opacity-60"
        sizes="100vw"
        loading="lazy"
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = 'none';
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/50" />

      <div className="relative z-10 text-center px-6">
        <h3 className="text-3xl font-bold text-white mb-4">{title}</h3>
        <div className="flex items-center justify-center gap-4 text-sm">
          <span className="text-white/50 font-mono">{ruinLabel}</span>
          <div className="w-16 h-0.5 bg-[#E50000]" />
          <span className="text-white/80 font-mono">{renovatedLabel}</span>
        </div>
      </div>
    </div>
  );
}
