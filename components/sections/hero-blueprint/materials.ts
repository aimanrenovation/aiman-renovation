import * as THREE from "three";
import { COLORS } from "./constants";

export const blueprintLineMaterial = new THREE.LineBasicMaterial({
  color: COLORS.blueprintLine,
  transparent: true,
});

export const concreteMaterial = new THREE.MeshStandardMaterial({
  color: COLORS.concrete,
  roughness: 0.9,
  metalness: 0.0,
});

export const woodMaterial = new THREE.MeshStandardMaterial({
  color: COLORS.wood,
  roughness: 0.7,
  metalness: 0.0,
});

export const tileMaterial = new THREE.MeshStandardMaterial({
  color: COLORS.tile,
  roughness: 0.3,
  metalness: 0.0,
});

export const copperMaterial = new THREE.MeshStandardMaterial({
  color: COLORS.copper,
  roughness: 0.4,
  metalness: 0.7,
});

export const electricRedMaterial = new THREE.MeshBasicMaterial({
  color: COLORS.electricRed,
});

export const electricBlueMaterial = new THREE.MeshBasicMaterial({
  color: COLORS.electricBlue,
});

// Paint shader — transitions from concrete to painted
export const paintShaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    paintProgress: { value: 0 },
    concreteColor: { value: new THREE.Color(COLORS.plaster) },
    paintColor: { value: new THREE.Color(COLORS.paintWhite) },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float paintProgress;
    uniform vec3 concreteColor;
    uniform vec3 paintColor;
    varying vec2 vUv;
    void main() {
      float edge = smoothstep(paintProgress - 0.05, paintProgress + 0.05, vUv.y);
      vec3 color = mix(paintColor, concreteColor, edge);
      gl_FragColor = vec4(color, 1.0);
    }
  `,
});
