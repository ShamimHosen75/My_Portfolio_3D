"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { stageState } from "@/lib/loadingStore";

/**
 * A clay-style cartoon developer, built from simple shapes.
 * Sits on a chair; in the hero only the head and shoulders are framed,
 * and the desk, monitor and phone fade in for the "What I do" view.
 */

const damp = THREE.MathUtils.damp;
const lerp = THREE.MathUtils.lerp;

function useMaterials() {
  return useMemo(() => {
    const clay = new THREE.MeshPhysicalMaterial({
      color: "#dedae2",
      roughness: 0.5,
      clearcoat: 0.35,
      clearcoatRoughness: 0.4,
      sheen: 0.6,
      sheenColor: new THREE.Color("#f3d9ff"),
      sheenRoughness: 0.5,
    });
    const skin = clay.clone();
    skin.color = new THREE.Color("#e6e2e8");
    const hair = new THREE.MeshPhysicalMaterial({
      color: "#141117",
      roughness: 0.5,
      clearcoat: 0.35,
      clearcoatRoughness: 0.4,
    });
    const dark = new THREE.MeshStandardMaterial({ color: "#121015", roughness: 0.6 });
    const eyeWhite = new THREE.MeshPhysicalMaterial({ color: "#f7f5f9", roughness: 0.12, clearcoat: 1 });
    const iris = new THREE.MeshPhysicalMaterial({ color: "#2b2140", roughness: 0.15, clearcoat: 1 });
    const mouth = new THREE.MeshStandardMaterial({ color: "#7c6672", roughness: 0.6 });
    const furniture = new THREE.MeshPhysicalMaterial({
      color: "#f1eef3",
      roughness: 0.42,
      clearcoat: 0.3,
      transparent: true,
    });
    const chair = furniture.clone();
    chair.color = new THREE.Color("#d9d4dd");
    const pink = new THREE.MeshPhysicalMaterial({
      color: "#f19ab9",
      roughness: 0.35,
      clearcoat: 0.6,
      emissive: new THREE.Color("#ff6fa5"),
      emissiveIntensity: 0.12,
      transparent: true,
    });
    const keys = new THREE.MeshStandardMaterial({ color: "#c9c3cf", roughness: 0.5, transparent: true });
    const shadow = new THREE.MeshBasicMaterial({
      map: radialTexture(),
      transparent: true,
      depthWrite: false,
      opacity: 0,
    });
    return { clay, skin, hair, dark, eyeWhite, iris, mouth, furniture, chair, pink, keys, shadow };
  }, []);
}

function radialTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(0,0,0,0.75)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function torsoGeometry() {
  const pts = [
    [0.0, 0.52],
    [0.18, 0.53],
    [0.23, 0.62],
    [0.26, 0.78],
    [0.29, 0.92],
    [0.3, 1.0],
    [0.25, 1.08],
    [0.13, 1.14],
    [0.0, 1.155],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.LatheGeometry(pts, 40);
  g.scale(1, 1, 0.68);
  g.computeVertexNormals();
  return g;
}

interface ArmProps {
  side: 1 | -1;
  mats: ReturnType<typeof useMaterials>;
  shoulder: React.RefObject<THREE.Group | null>;
  elbow: React.RefObject<THREE.Group | null>;
}

function Arm({ side, mats, shoulder, elbow }: ArmProps) {
  return (
    <group ref={shoulder} position={[side * 0.3, 1.02, 0]}>
      <mesh material={mats.clay} position={[0, -0.12, 0]}>
        <capsuleGeometry args={[0.075, 0.2, 8, 16]} />
      </mesh>
      <group ref={elbow} position={[0, -0.26, 0]}>
        <mesh material={mats.clay} position={[0, -0.11, 0]}>
          <capsuleGeometry args={[0.054, 0.19, 8, 16]} />
        </mesh>
        <mesh material={mats.skin} position={[0, -0.255, 0.005]} scale={[0.9, 1.1, 0.75]}>
          <sphereGeometry args={[0.056, 20, 16]} />
        </mesh>
      </group>
    </group>
  );
}

function Leg({ side, mats }: { side: 1 | -1; mats: ReturnType<typeof useMaterials> }) {
  const x = side * 0.1;
  return (
    <group>
      <mesh material={mats.clay} position={[x, 0.56, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.088, 0.38, 8, 16]} />
      </mesh>
      <mesh material={mats.clay} position={[x, 0.33, 0.43]}>
        <capsuleGeometry args={[0.072, 0.4, 8, 16]} />
      </mesh>
      <mesh material={mats.skin} position={[x, 0.06, 0.48]} scale={[0.85, 0.55, 1.4]}>
        <sphereGeometry args={[0.085, 20, 16]} />
      </mesh>
    </group>
  );
}

function Head({ mats }: { mats: ReturnType<typeof useMaterials> }) {
  const lidL = useRef<THREE.Mesh>(null);
  const lidR = useRef<THREE.Mesh>(null);
  const irisL = useRef<THREE.Group>(null);
  const irisR = useRef<THREE.Group>(null);
  const blink = useRef({ next: 2.5, t: -1 });

  useFrame((state, dt) => {
    const time = state.clock.elapsedTime;
    const b = blink.current;
    if (b.t < 0 && time > b.next) b.t = 0;
    let close = 0;
    if (b.t >= 0) {
      b.t += dt;
      close = Math.sin(Math.min(1, b.t / 0.18) * Math.PI);
      if (b.t > 0.18) {
        b.t = -1;
        b.next = time + 2 + Math.random() * 3.5;
      }
    }
    // Sleepy half-closed lids that close fully on a blink.
    const lid = 0.18 + close * 1.39;
    if (lidL.current) lidL.current.rotation.x = lid;
    if (lidR.current) lidR.current.rotation.x = lid;
    const ix = THREE.MathUtils.clamp(stageState.pointerX, -1, 1) * 0.012 * (1 - stageState.desk);
    const iy = THREE.MathUtils.clamp(stageState.pointerY, -1, 1) * 0.006 * (1 - stageState.desk);
    for (const g of [irisL.current, irisR.current]) {
      if (!g) continue;
      g.position.x = damp(g.position.x, ix, 8, dt);
      g.position.y = damp(g.position.y, iy, 8, dt);
    }
  });

  const eye = (side: 1 | -1, lidRef: React.RefObject<THREE.Mesh | null>, irisRef: React.RefObject<THREE.Group | null>) => (
    <group position={[side * 0.083, 0.012, 0.163]} rotation={[0, side * 0.32, 0]}>
      <mesh material={mats.eyeWhite} scale={[1, 0.86, 0.6]}>
        <sphereGeometry args={[0.056, 24, 18]} />
      </mesh>
      <group ref={irisRef}>
        <mesh material={mats.iris} position={[0, -0.006, 0.026]} scale={[1, 1, 0.45]}>
          <sphereGeometry args={[0.036, 20, 16]} />
        </mesh>
        <mesh material={mats.eyeWhite} position={[0.011, 0.004, 0.043]}>
          <sphereGeometry args={[0.006, 8, 8]} />
        </mesh>
      </group>
      {/* Upper lid: a skin-coloured cap that rotates down over the eye */}
      <mesh ref={lidRef} material={mats.skin} scale={[1.08, 0.95, 0.68]}>
        <sphereGeometry args={[0.06, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        {/* Lash line along the lid edge */}
        <mesh material={mats.hair} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.06, 0.0075, 6, 24, Math.PI]} />
        </mesh>
      </mesh>
      {/* Lower lid bag */}
      <mesh material={mats.skin} position={[0, -0.044, 0.004]} rotation={[0.2, 0, 0]} scale={[1.0, 0.3, 0.5]}>
        <sphereGeometry args={[0.055, 20, 10]} />
      </mesh>
    </group>
  );

  return (
    <group>
      {/* Skull and jaw */}
      <mesh material={mats.skin} scale={[1, 1.1, 0.98]}>
        <sphereGeometry args={[0.215, 48, 36]} />
      </mesh>

      {eye(-1, lidL, irisL)}
      {eye(1, lidR, irisR)}

      {/* Brows */}
      {([-1, 1] as const).map((s) => (
        <mesh
          key={s}
          material={mats.hair}
          position={[s * 0.088, 0.085, 0.19]}
          rotation={[0.25, s * 0.3, Math.PI / 2 + s * 0.12]}
        >
          <capsuleGeometry args={[0.017, 0.085, 6, 12]} />
        </mesh>
      ))}

      {/* Nose */}
      <mesh material={mats.skin} position={[0, -0.045, 0.214]} scale={[0.9, 0.85, 0.9]}>
        <sphereGeometry args={[0.038, 24, 18]} />
      </mesh>

      {/* Smirk */}
      <mesh material={mats.mouth} position={[0.012, -0.118, 0.19]} rotation={[0.25, 0.08, Math.PI + 0.55]}>
        <torusGeometry args={[0.052, 0.0065, 8, 28, Math.PI * 0.55]} />
      </mesh>

      {/* Ears */}
      {([-1, 1] as const).map((s) => (
        <group key={s} position={[s * 0.212, -0.005, -0.01]} rotation={[0, s * 0.45, s * -0.12]}>
          <mesh material={mats.skin} scale={[0.42, 0.78, 0.6]}>
            <sphereGeometry args={[0.11, 24, 18]} />
          </mesh>
          <mesh material={mats.clay} position={[s * 0.012, 0, 0.02]} scale={[0.25, 0.55, 0.4]}>
            <sphereGeometry args={[0.1, 16, 12]} />
          </mesh>
        </group>
      ))}

      {/* Hair: a cap plus a swept quiff */}
      <mesh material={mats.hair} position={[0, 0.05, -0.012]} rotation={[-0.42, 0, 0]} scale={[1.07, 1, 1.06]}>
        <sphereGeometry args={[0.225, 40, 24, 0, Math.PI * 2, 0, Math.PI * 0.56]} />
      </mesh>
      <mesh material={mats.hair} position={[-0.03, 0.17, 0.1]} rotation={[0.5, 0.2, 0.25]} scale={[1.35, 0.55, 0.9]}>
        <sphereGeometry args={[0.13, 32, 20]} />
      </mesh>
      <mesh material={mats.hair} position={[0.08, 0.16, 0.08]} rotation={[0.4, -0.3, -0.2]} scale={[1.1, 0.5, 0.85]}>
        <sphereGeometry args={[0.12, 28, 18]} />
      </mesh>
      {([-1, 1] as const).map((s) => (
        <mesh key={s} material={mats.hair} position={[s * 0.19, 0.06, 0.05]} scale={[0.35, 1, 0.7]}>
          <sphereGeometry args={[0.07, 16, 12]} />
        </mesh>
      ))}
    </group>
  );
}

export function Character() {
  const mats = useMaterials();
  const torso = useMemo(torsoGeometry, []);

  const rig = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const desk = useRef<THREE.Group>(null);
  const shoulderL = useRef<THREE.Group>(null);
  const shoulderR = useRef<THREE.Group>(null);
  const elbowL = useRef<THREE.Group>(null);
  const elbowR = useRef<THREE.Group>(null);
  const smooth = useRef({ about: 0, desk: 0, reveal: 0 });

  useFrame((state, dt) => {
    const s = smooth.current;
    s.about = damp(s.about, stageState.about, 6, dt);
    s.desk = damp(s.desk, stageState.desk, 6, dt);
    s.reveal = damp(s.reveal, stageState.revealed ? 1 : 0, 3.5, dt);
    const t = state.clock.elapsedTime;
    const d = s.desk;
    const typing = THREE.MathUtils.smoothstep(d, 0.55, 1);

    if (rig.current) {
      rig.current.rotation.y = d * 0.95;
      rig.current.position.x = d * -0.45;
      // Rises gently into place when the site is revealed.
      rig.current.position.y = (1 - s.reveal) * -0.25;
    }
    if (body.current) {
      // Idle breathing.
      body.current.scale.y = 1 + Math.sin(t * 1.6) * 0.006;
    }

    // Head: follows the pointer in the hero, looks at the screen at the desk.
    if (head.current) {
      const px = stageState.pointerX * (1 - d);
      const py = stageState.pointerY * (1 - d);
      const yaw = px * 0.5 + s.about * -0.25 * (1 - d);
      const pitch = -py * 0.28 + d * 0.12 + typing * Math.sin(t * 0.7) * 0.02;
      head.current.rotation.y = damp(head.current.rotation.y, yaw, 5, dt);
      head.current.rotation.x = damp(head.current.rotation.x, pitch, 5, dt);
      head.current.rotation.z = damp(head.current.rotation.z, -px * 0.06, 5, dt);
    }

    // Arms blend from hanging at the sides to typing.
    const arms: [THREE.Group | null, THREE.Group | null, 1 | -1][] = [
      [shoulderL.current, elbowL.current, -1],
      [shoulderR.current, elbowR.current, 1],
    ];
    for (const [sh, el, side] of arms) {
      if (!sh || !el) continue;
      const tap = typing * Math.max(0, Math.sin(t * 11 + (side > 0 ? 0 : 1.7))) * 0.07;
      sh.rotation.x = lerp(0.04, -0.62, d) + tap * 0.4;
      sh.rotation.z = lerp(side * 0.06, side * -0.3, d);
      el.rotation.x = lerp(-0.05, -1.08, d) - tap;
      el.rotation.z = lerp(0, side * -0.25, d);
    }

    if (desk.current) {
      const show = THREE.MathUtils.smoothstep(d, 0.15, 0.85);
      desk.current.visible = show > 0.01;
      desk.current.position.y = (1 - show) * -0.35;
      mats.furniture.opacity = show;
      mats.chair.opacity = show;
      mats.pink.opacity = show;
      mats.keys.opacity = show;
      mats.shadow.opacity = show * 0.9;
      const transparent = show < 0.999;
      for (const m of [mats.furniture, mats.chair, mats.pink, mats.keys]) {
        if (m.transparent !== transparent) {
          m.transparent = transparent;
          m.needsUpdate = true;
        }
        m.depthWrite = !transparent;
      }
    }
  });

  return (
    <group ref={rig}>
      <group ref={body}>
        {/* Torso, turtleneck and hips */}
        <mesh geometry={torso} material={mats.clay} />
        <mesh material={mats.clay} position={[0, 1.02, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 0.8]}>
          <capsuleGeometry args={[0.11, 0.44, 8, 20]} />
        </mesh>
        <mesh material={mats.clay} position={[0, 1.16, 0]}>
          <cylinderGeometry args={[0.078, 0.092, 0.11, 28]} />
        </mesh>
        <mesh material={mats.clay} position={[0, 1.205, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.072, 0.03, 12, 32]} />
        </mesh>
        <mesh material={mats.clay} position={[0, 0.56, 0.02]} scale={[1.15, 0.6, 1]}>
          <sphereGeometry args={[0.19, 28, 20]} />
        </mesh>

        <Arm side={-1} mats={mats} shoulder={shoulderL} elbow={elbowL} />
        <Arm side={1} mats={mats} shoulder={shoulderR} elbow={elbowR} />

        <group ref={head} position={[0, 1.42, 0.01]}>
          <Head mats={mats} />
        </group>
      </group>

      <Leg side={-1} mats={mats} />
      <Leg side={1} mats={mats} />

      <group ref={desk}>
        {/* Chair */}
        <mesh material={mats.chair} position={[0, 0.445, 0.03]}>
          <boxGeometry args={[0.5, 0.045, 0.48]} />
        </mesh>
        <mesh material={mats.chair} position={[0, 0.78, -0.26]} rotation={[-0.12, 0, 0]}>
          <boxGeometry args={[0.46, 0.5, 0.035]} />
        </mesh>
        {[
          [-0.21, 0.2],
          [0.21, 0.2],
          [-0.21, -0.18],
          [0.21, -0.18],
        ].map(([x, z], i) => (
          <mesh key={i} material={mats.chair} position={[x, 0.21, z]} rotation={[z > 0 ? 0.1 : -0.12, 0, 0]}>
            <cylinderGeometry args={[0.016, 0.016, 0.44, 10]} />
          </mesh>
        ))}

        {/* Desk */}
        <mesh material={mats.furniture} position={[0.12, 0.765, 0.64]}>
          <boxGeometry args={[1.5, 0.035, 0.68]} />
        </mesh>
        {[-0.56, 0.8].map((x) => (
          <group key={x}>
            <mesh material={mats.furniture} position={[x, 0.38, 0.64]}>
              <boxGeometry args={[0.05, 0.74, 0.05]} />
            </mesh>
            <mesh material={mats.furniture} position={[x, 0.012, 0.64]}>
              <boxGeometry args={[0.07, 0.025, 0.6]} />
            </mesh>
          </group>
        ))}

        {/* Keyboard and mouse */}
        <mesh material={mats.keys} position={[0, 0.792, 0.47]} rotation={[0.04, 0, 0]}>
          <boxGeometry args={[0.46, 0.018, 0.15]} />
        </mesh>
        <mesh material={mats.furniture} position={[0, 0.803, 0.47]} rotation={[0.04, 0, 0]}>
          <boxGeometry args={[0.43, 0.006, 0.12]} />
        </mesh>

        {/* Monitor */}
        <mesh material={mats.pink} position={[0.04, 1.16, 0.86]} rotation={[-0.06, 0, 0]}>
          <boxGeometry args={[0.66, 0.44, 0.045]} />
        </mesh>
        <mesh material={mats.pink} position={[0.04, 0.92, 0.9]}>
          <boxGeometry args={[0.06, 0.28, 0.035]} />
        </mesh>
        <mesh material={mats.pink} position={[0.04, 0.79, 0.88]}>
          <boxGeometry args={[0.24, 0.015, 0.16]} />
        </mesh>

        {/* Phone on a stand */}
        <mesh material={mats.pink} position={[0.48, 0.87, 0.62]} rotation={[-0.25, -0.5, 0]}>
          <boxGeometry args={[0.075, 0.15, 0.012]} />
        </mesh>

        {/* Soft floor shadow */}
        <mesh material={mats.shadow} position={[0.12, 0.002, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.4, 1.8]} />
        </mesh>
      </group>
    </group>
  );
}
