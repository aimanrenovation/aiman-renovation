"use client";

import { useRef, useState } from "react";
import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";
import type { ZoneId } from "./devis-types";

interface House3DProps {
  selectedZones: ZoneId[];
  activeZone: ZoneId | null;
  onZoneClick: (zone: ZoneId) => void;
  onZoneHover: (zone: ZoneId | null) => void;
  showDamage: boolean;
  renovationProgress: Record<ZoneId, number>;
}

interface ZoneMeshProps {
  zoneId: ZoneId;
  isSelected: boolean;
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
  showDamage: boolean;
  renovationProgress: number;
}

const COLORS = {
  red: "#E50000",
  black: "#0A0A0A",
  white: "#FFFFFF",
  damaged: "#8B7355",
  renovated: "#F5F5F0",
  selected: "#E50000",
  hover: "#FF3333",
  default: "#D4C5A9",
  roof: "#8B4513",
  roofRenovated: "#A0522D",
  grass: "#4A7C59",
  grassDamaged: "#8B7355",
  concrete: "#999999",
};

function ZoneMesh({
  zoneId,
  isSelected,
  isActive,
  isHovered,
  onClick,
  onPointerOver,
  onPointerOut,
  showDamage,
  renovationProgress,
}: ZoneMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const getColor = () => {
    if (isActive) return COLORS.selected;
    if (isHovered) return COLORS.hover;
    if (isSelected) return new THREE.Color(COLORS.selected).lerp(new THREE.Color(COLORS.renovated), 0.5).getStyle();
    if (showDamage) return COLORS.damaged;
    return THREE.MathUtils.lerp(0, 1, renovationProgress) > 0.5 ? COLORS.renovated : COLORS.default;
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick();
  };

  const zoneGeometry: Record<ZoneId, { position: [number, number, number]; args: [number, number, number] }> = {
    cuisine: { position: [-1.2, 0.75, 0.8], args: [1.8, 1.5, 1.4] },
    "salle-de-bain": { position: [1.2, 0.75, 0.8], args: [1.4, 1.5, 1.4] },
    facade: { position: [0, 1.5, -1.5], args: [4.2, 3, 0.15] },
    toit: { position: [0, 3.5, 0], args: [4.6, 0.15, 3.6] },
    garage: { position: [3, 0.6, 0], args: [1.8, 1.2, 2.8] },
    exterieur: { position: [-3, 0.05, 0], args: [2, 0.1, 3] },
  };

  const config = zoneGeometry[zoneId];

  return (
    <mesh
      ref={meshRef}
      position={config.position}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        onPointerOver();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        onPointerOut();
        document.body.style.cursor = "default";
      }}
    >
      {zoneId === "toit" ? (
        <coneGeometry args={[2.8, 1.5, 4]} />
      ) : (
        <boxGeometry args={config.args} />
      )}
      <meshStandardMaterial
        color={getColor()}
        transparent={isHovered && !isSelected}
        opacity={isHovered && !isSelected ? 0.8 : 1}
        emissive={isActive ? COLORS.selected : "#000000"}
        emissiveIntensity={isActive ? 0.15 : 0}
      />
    </mesh>
  );
}

export function House3D({
  selectedZones,
  activeZone,
  onZoneClick,
  onZoneHover,
  showDamage,
  renovationProgress,
}: House3DProps) {
  const [hoveredZone, setHoveredZone] = useState<ZoneId | null>(null);

  const zones: ZoneId[] = ["cuisine", "salle-de-bain", "facade", "toit", "garage", "exterieur"];

  return (
    <group>
      {/* Sol */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial color="#3A5F3A" />
      </mesh>

      {/* Structure principale de la maison */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[4, 3, 2.8]} />
        <meshStandardMaterial color={showDamage ? "#B8A88A" : "#F0EBE0"} />
      </mesh>

      {/* Zones cliquables (overlays) */}
      {zones.map((zoneId) => (
        <ZoneMesh
          key={zoneId}
          zoneId={zoneId}
          isSelected={selectedZones.includes(zoneId)}
          isActive={activeZone === zoneId}
          isHovered={hoveredZone === zoneId}
          onClick={() => onZoneClick(zoneId)}
          onPointerOver={() => {
            setHoveredZone(zoneId);
            onZoneHover(zoneId);
          }}
          onPointerOut={() => {
            setHoveredZone(null);
            onZoneHover(null);
          }}
          showDamage={showDamage}
          renovationProgress={renovationProgress[zoneId] || 0}
        />
      ))}

      {/* Eclairage */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1} castShadow />
      <directionalLight position={[-3, 4, -2]} intensity={0.3} />
    </group>
  );
}
