'use client';

import { useState, useEffect } from 'react';

interface GPUInfo {
  isLowEnd: boolean;
  renderer: string;
  vendor: string;
  hasWebGL: boolean;
}

const LOW_END_KEYWORDS = [
  'swiftshader',
  'llvmpipe',
  'software',
  'microsoft basic',
  'vmware',
  'virtualbox',
];

export default function useGPUDetect(): GPUInfo {
  const [gpuInfo, setGPUInfo] = useState<GPUInfo>({
    isLowEnd: false,
    renderer: '',
    vendor: '',
    hasWebGL: true,
  });

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

      if (!gl) {
        setGPUInfo({ isLowEnd: true, renderer: 'none', vendor: 'none', hasWebGL: false });
        return;
      }

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        : 'unknown';
      const vendor = debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
        : 'unknown';

      const rendererLower = renderer.toLowerCase();
      const isLowEnd = LOW_END_KEYWORDS.some((kw) => rendererLower.includes(kw));

      const isMobileWithLowRAM =
        /Android|iPhone|iPad/.test(navigator.userAgent) &&
        (navigator as unknown as { deviceMemory?: number }).deviceMemory !== undefined &&
        ((navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 4) < 4;

      setGPUInfo({
        isLowEnd: isLowEnd || isMobileWithLowRAM,
        renderer,
        vendor,
        hasWebGL: true,
      });

      const loseContext = gl.getExtension('WEBGL_lose_context');
      loseContext?.loseContext();
    } catch {
      setGPUInfo({ isLowEnd: true, renderer: 'error', vendor: 'error', hasWebGL: false });
    }
  }, []);

  return gpuInfo;
}
