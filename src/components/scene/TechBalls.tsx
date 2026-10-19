"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { BallCollider, Physics, RigidBody, type RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { techStack, type TechIcon } from "@/data/skills";

function luminance(hex: string) {
  const n = parseInt(hex, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/** Equirectangular texture: brand-coloured ball with the logo on the front and back. */
function makeTexture(icon: TechIcon, i: number) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  const lum = luminance(icon.hex);
  const dark = lum < 0.18;
  // Every few balls is white with a coloured logo, like the reference.
  const white = !dark && i % 4 === 3;
  const base = dark ? "#16121a" : white ? "#f1eef4" : `#${icon.hex}`;
  const ink = white ? `#${icon.hex}` : lum > 0.62 ? "#16121a" : "#ffffff";
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 512, 256);
  // Soft stripe band, like a tennis ball seam.
  ctx.strokeStyle = dark ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.28)";
  ctx.lineWidth = 10;
  ctx.beginPath();
  for (let x = 0; x <= 512; x += 4) {
    const y = 128 + Math.sin((x / 512) * Math.PI * 2) * 70;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  const path = new Path2D(icon.path);
  ctx.fillStyle = ink;
  for (const cx of [128, 384]) {
    ctx.save();
    ctx.translate(cx - 48, 128 - 40);
    ctx.scale(4, 80 / 24);
    ctx.fill(path);
    ctx.restore();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

const sphere = new THREE.SphereGeometry(1, 40, 28);
const tmp = new THREE.Vector3();

function Ball({ icon, index, scale, start }: { icon: TechIcon; index: number; scale: number; start: [number, number, number] }) {
  const body = useRef<RapierRigidBody>(null);
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: makeTexture(icon, index),
        roughness: 0.32,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
      }),
    [icon, index],
  );
  useEffect(() => () => {
    material.map?.dispose();
    material.dispose();
  }, [material]);

  useFrame((_, dt) => {
    const b = body.current;
    if (!b) return;
    // Pull every ball gently towards the centre.
    const p = b.translation();
    tmp.set(p.x, p.y + 1.2, p.z).multiplyScalar(-4 * Math.min(dt, 0.05) * scale * scale);
    b.applyImpulse(tmp, true);
  });

  return (
    <RigidBody
      ref={body}
      colliders={false}
      position={start}
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      restitution={0.3}
      rotation={[0, Math.random() * Math.PI * 2, Math.random() * 0.6 - 0.3]}
    >
      <BallCollider args={[scale]} />
      <mesh geometry={sphere} material={material} scale={scale} />
    </RigidBody>
  );
}

/** Invisible ball that follows the pointer and pushes the others away. */
function Pointer() {
  const body = useRef<RapierRigidBody>(null);
  const viewport = useThree((s) => s.viewport);
  const target = useRef(new THREE.Vector3(100, 100, 0));
  useEffect(() => {
    const canvas = document.querySelector<HTMLCanvasElement>("[data-tech-canvas] canvas");
    const onMove = (e: PointerEvent) => {
      const rect = canvas?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      target.current.set((x * viewport.width) / 2, (y * viewport.height) / 2, 0);
    };
    const onLeave = () => target.current.set(100, 100, 0);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [viewport.width, viewport.height]);
  useFrame(() => body.current?.setNextKinematicTranslation(target.current));
  return (
    <RigidBody ref={body} type="kinematicPosition" colliders={false} position={[100, 100, 0]}>
      <BallCollider args={[1.2]} />
    </RigidBody>
  );
}

export default function TechBalls({ active, compact }: { active: boolean; compact: boolean }) {
  const balls = useMemo(() => {
    const list = compact ? techStack.slice(0, 16) : techStack;
    return list.map((icon, i) => {
      const angle = (i / list.length) * Math.PI * 2;
      const r = 3 + (i % 4);
      return {
        icon,
        index: i,
        scale: (compact ? 0.6 : 0.72) * (0.85 + ((i * 37) % 10) / 22),
        start: [Math.cos(angle) * r, Math.sin(angle) * r * 0.7, (i % 3) - 1] as [number, number, number],
      };
    });
  }, [compact]);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 20], fov: 32, near: 1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 6, 10]} intensity={2.4} />
      <directionalLight position={[-8, 3, -4]} intensity={4} color="#9b5cff" />
      <directionalLight position={[8, -4, -2]} intensity={2.5} color="#ff73d6" />
      <Physics gravity={[0, 0, 0]} paused={!active} timeStep="vary">
        <Pointer />
        {balls.map((b) => (
          <Ball key={b.icon.title} {...b} />
        ))}
      </Physics>
    </Canvas>
  );
}
