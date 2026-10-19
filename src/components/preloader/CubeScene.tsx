"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useProgress, useTexture } from "@react-three/drei";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

interface CubeSceneProps {
  exploding: boolean;
  /** 0–100, how much of the scene's assets have loaded. */
  onProgress: (value: number) => void;
}

type Axis = "x" | "y" | "z";
type Turn = { axis: Axis; layer: -1 | 0 | 1; dir: 1 | -1; duration: number };
type Step = Turn | { pause: number };

const AXES: Axis[] = ["x", "y", "z"];
const AXIS_VEC: Record<Axis, THREE.Vector3> = {
  x: new THREE.Vector3(1, 0, 0),
  y: new THREE.Vector3(0, 1, 0),
  z: new THREE.Vector3(0, 0, 1),
};

// Face colours in order +x, -x, +y, -y, +z, -z. The front face (+z) uses the accent colour.
const FACE_COLORS = [
  "#E4572E",
  "#3BA99C",
  "#DCE7E2",
  "#F4D35E",
  "#F2A541",
  "#4F86C6",
];

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function makeScramble(count: number): Step[] {
  const turns: Turn[] = [];
  let lastAxis: Axis | null = null;
  for (let i = 0; i < count; i++) {
    const options = AXES.filter((a) => a !== lastAxis);
    const axis = options[Math.floor(Math.random() * options.length)];
    lastAxis = axis;
    turns.push({
      axis,
      layer: ([-1, 0, 1] as const)[Math.floor(Math.random() * 3)],
      dir: Math.random() < 0.5 ? 1 : -1,
      duration: 0.24,
    });
  }
  // Solving is just the scramble played backwards with each turn reversed.
  const solve = [...turns]
    .reverse()
    .map((t) => ({ ...t, dir: (t.dir * -1) as 1 | -1, duration: 0.3 }));
  return [{ pause: 0.35 }, ...turns, { pause: 0.5 }, ...solve, { pause: 0.8 }];
}

function roundedSquare(size: number, radius: number) {
  const h = size / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-h + radius, -h);
  shape.lineTo(h - radius, -h);
  shape.quadraticCurveTo(h, -h, h, -h + radius);
  shape.lineTo(h, h - radius);
  shape.quadraticCurveTo(h, h, h - radius, h);
  shape.lineTo(-h + radius, h);
  shape.quadraticCurveTo(-h, h, -h, h - radius);
  shape.lineTo(-h, -h + radius);
  shape.quadraticCurveTo(-h, -h, -h + radius, -h);
  return new THREE.ShapeGeometry(shape, 4);
}

interface Piece {
  group: THREE.Group;
  basePos: THREE.Vector3;
  baseQuat: THREE.Quaternion;
  velocity: THREE.Vector3;
  spinAxis: THREE.Vector3;
  spinSpeed: number;
}

function RubiksCube({
  exploding,
  onReady,
}: {
  exploding: boolean;
  onReady: () => void;
}) {
  const logo = useTexture("/textures/sticker-logo.png");
  const root = useRef<THREE.Group>(null);
  const camera = useThree((s) => s.camera);

  const { pieces, dispose } = useMemo(() => {
    logo.colorSpace = THREE.SRGBColorSpace;
    const bodyGeo = new RoundedBoxGeometry(0.96, 0.96, 0.96, 3, 0.1);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: "#0B1E22",
      roughness: 0.55,
      metalness: 0.1,
    });
    const stickerGeo = roundedSquare(0.8, 0.12);
    const stickerMats = FACE_COLORS.map(
      (color) =>
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.35,
          metalness: 0.05,
        }),
    );
    const logoMat = new THREE.MeshStandardMaterial({
      map: logo,
      roughness: 0.35,
    });

    const faces = [
      {
        test: (x: number) => x === 1,
        pos: [0.485, 0, 0],
        rot: [0, Math.PI / 2, 0],
        axis: 0,
      },
      {
        test: (x: number) => x === -1,
        pos: [-0.485, 0, 0],
        rot: [0, -Math.PI / 2, 0],
        axis: 0,
      },
      {
        test: (y: number) => y === 1,
        pos: [0, 0.485, 0],
        rot: [-Math.PI / 2, 0, 0],
        axis: 1,
      },
      {
        test: (y: number) => y === -1,
        pos: [0, -0.485, 0],
        rot: [Math.PI / 2, 0, 0],
        axis: 1,
      },
      {
        test: (z: number) => z === 1,
        pos: [0, 0, 0.485],
        rot: [0, 0, 0],
        axis: 2,
      },
      {
        test: (z: number) => z === -1,
        pos: [0, 0, -0.485],
        rot: [0, Math.PI, 0],
        axis: 2,
      },
    ] as const;

    const list: Piece[] = [];
    for (let x = -1; x <= 1; x++)
      for (let y = -1; y <= 1; y++)
        for (let z = -1; z <= 1; z++) {
          const group = new THREE.Group();
          group.position.set(x, y, z);
          group.add(new THREE.Mesh(bodyGeo, bodyMat));
          const coords = [x, y, z];
          faces.forEach((face, i) => {
            if (!face.test(coords[face.axis])) return;
            const isLogo = i === 4 && x === 0 && y === 0;
            const sticker = new THREE.Mesh(
              stickerGeo,
              isLogo ? logoMat : stickerMats[i],
            );
            sticker.position.set(face.pos[0], face.pos[1], face.pos[2]);
            sticker.rotation.set(face.rot[0], face.rot[1], face.rot[2]);
            group.add(sticker);
          });
          list.push({
            group,
            basePos: new THREE.Vector3(),
            baseQuat: new THREE.Quaternion(),
            velocity: new THREE.Vector3(),
            spinAxis: new THREE.Vector3(),
            spinSpeed: 0,
          });
        }

    return {
      pieces: list,
      dispose: () => {
        bodyGeo.dispose();
        bodyMat.dispose();
        stickerGeo.dispose();
        stickerMats.forEach((m) => m.dispose());
        logoMat.dispose();
      },
    };
  }, [logo]);

  useEffect(() => {
    const group = root.current;
    if (!group) return;
    pieces.forEach((p) => group.add(p.group));
    onReady();
    return () => {
      pieces.forEach((p) => group.remove(p.group));
      dispose();
    };
  }, [pieces, dispose, onReady]);

  const queue = useRef<Step[]>([]);
  const current = useRef<{ step: Step; t: number; members: Piece[] } | null>(
    null,
  );
  const exploded = useRef(false);
  const tmpQuat = useMemo(() => new THREE.Quaternion(), []);

  useFrame((_, rawDelta) => {
    const group = root.current;
    if (!group) return;
    const dt = Math.min(rawDelta, 1 / 30);

    if (exploding) {
      if (!exploded.current) {
        exploded.current = true;
        // Fling every piece outwards and toward the camera.
        const camLocal = group.worldToLocal(camera.position.clone());
        pieces.forEach((p) => {
          const toCamera = camLocal.clone().sub(p.group.position).normalize();
          const outward = p.group.position.clone().normalize();
          const jitter = new THREE.Vector3()
            .randomDirection()
            .multiplyScalar(0.35);
          p.velocity
            .copy(toCamera.multiplyScalar(0.8))
            .add(outward.multiplyScalar(0.7))
            .add(jitter)
            .normalize()
            .multiplyScalar(5 + Math.random() * 4);
          p.spinAxis.randomDirection();
          p.spinSpeed = 2 + Math.random() * 5;
        });
      }
      pieces.forEach((p) => {
        p.velocity.multiplyScalar(1 + dt * 2.2);
        p.group.position.addScaledVector(p.velocity, dt);
        tmpQuat.setFromAxisAngle(p.spinAxis, p.spinSpeed * dt);
        p.group.quaternion.premultiply(tmpQuat);
      });
      return;
    }

    group.rotation.y += dt * 0.35;

    if (!current.current) {
      if (queue.current.length === 0) queue.current = makeScramble(9);
      const step = queue.current.shift()!;
      const members =
        "axis" in step
          ? pieces.filter(
              (p) => Math.round(p.group.position[step.axis]) === step.layer,
            )
          : [];
      members.forEach((m) => {
        m.basePos.copy(m.group.position);
        m.baseQuat.copy(m.group.quaternion);
      });
      current.current = { step, t: 0, members };
    }

    const active = current.current;
    const { step } = active;
    const duration = "axis" in step ? step.duration : step.pause;
    active.t = Math.min(1, active.t + dt / duration);

    if ("axis" in step) {
      const angle = easeInOut(active.t) * step.dir * (Math.PI / 2);
      tmpQuat.setFromAxisAngle(AXIS_VEC[step.axis], angle);
      active.members.forEach((m) => {
        m.group.position.copy(m.basePos).applyQuaternion(tmpQuat);
        m.group.quaternion.copy(tmpQuat).multiply(m.baseQuat);
        if (active.t === 1) {
          m.group.position.set(
            Math.round(m.group.position.x),
            Math.round(m.group.position.y),
            Math.round(m.group.position.z),
          );
          m.group.quaternion.normalize();
        }
      });
    }

    if (active.t === 1) current.current = null;
  });

  return <group ref={root} rotation={[0.1, -0.5, 0]} />;
}

function CameraRig() {
  const { camera, size } = useThree();
  useEffect(() => {
    // Pull the camera back on narrow screens so the whole cube stays in frame.
    const aspect = size.width / size.height;
    const distance = 14 * Math.max(1, 1.1 / aspect);
    camera.position.set(1, 0.85, 1.25).normalize().multiplyScalar(distance);
    camera.lookAt(0, 0, 0);
  }, [camera, size]);
  return null;
}

function ProgressReporter({
  ready,
  onProgress,
}: {
  ready: boolean;
  onProgress: (v: number) => void;
}) {
  const { progress } = useProgress();
  useEffect(() => {
    onProgress(ready ? 100 : Math.min(progress, 99));
  }, [ready, progress, onProgress]);
  return null;
}

function SceneContent({ exploding, onProgress }: CubeSceneProps) {
  const [ready, setReady] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);
  return (
    <>
      <ProgressReporter ready={ready} onProgress={onProgress} />
      <Suspense fallback={null}>
        <RubiksCube exploding={exploding} onReady={handleReady} />
      </Suspense>
    </>
  );
}

export default function CubeScene(props: CubeSceneProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ fov: 30, near: 0.1, far: 100, position: [6, 5, 7.5] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 6]} intensity={2} />
      <directionalLight
        position={[-6, -3, -4]}
        intensity={0.5}
        color="#9FB5B0"
      />
      <CameraRig />
      <SceneContent {...props} />
    </Canvas>
  );
}
