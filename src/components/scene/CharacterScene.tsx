"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Character } from "./Character";
import { setSceneProgress, stageState } from "@/lib/loadingStore";

const damp = THREE.MathUtils.damp;

/** Camera keyframes: [position, look-at] for the hero, about and desk views. */
function keyframes(aspect: number) {
  const portrait = aspect < 0.9;
  if (portrait) {
    // Phones: keep the character centred and lower, under the text.
    return {
      hero: { pos: new THREE.Vector3(0, 1.62, 3.1), look: new THREE.Vector3(0, 1.62, 0) },
      about: { pos: new THREE.Vector3(0, 1.55, 3.4), look: new THREE.Vector3(0, 1.75, 0) },
      desk: { pos: new THREE.Vector3(0, 1.3, 6.4), look: new THREE.Vector3(0, 1.25, 0.2) },
    };
  }
  const wide = THREE.MathUtils.clamp((aspect - 1.2) / 0.6, 0, 1);
  return {
    hero: {
      pos: new THREE.Vector3(0, 1.36, THREE.MathUtils.lerp(2.8, 2.4, wide)),
      look: new THREE.Vector3(0, 1.33, 0),
    },
    about: { pos: new THREE.Vector3(0.48, 1.4, 1.95), look: new THREE.Vector3(0.48, 1.36, 0) },
    desk: { pos: new THREE.Vector3(0.32, 1.15, THREE.MathUtils.lerp(5.4, 4.6, wide)), look: new THREE.Vector3(0.32, 0.78, 0.2) },
  };
}

function CameraRig() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const look = useRef(new THREE.Vector3(0, 1.34, 0));
  const target = useRef({ pos: new THREE.Vector3(), look: new THREE.Vector3() });
  const s = useRef({ about: 0, desk: 0, first: true });

  useFrame((_, dt) => {
    const k = keyframes(size.width / size.height);
    const st = s.current;
    st.about = damp(st.about, stageState.about, 5, dt);
    st.desk = damp(st.desk, stageState.desk, 5, dt);
    const { pos, look: lk } = target.current;
    pos.lerpVectors(k.hero.pos, k.about.pos, st.about).lerp(k.desk.pos, st.desk);
    lk.lerpVectors(k.hero.look, k.about.look, st.about).lerp(k.desk.look, st.desk);
    // Slight parallax from the pointer.
    pos.x += stageState.pointerX * 0.04 * (1 - st.desk);
    pos.y += stageState.pointerY * 0.02;
    if (st.first) {
      camera.position.copy(pos);
      look.current.copy(lk);
      st.first = false;
    } else {
      camera.position.x = damp(camera.position.x, pos.x, 6, dt);
      camera.position.y = damp(camera.position.y, pos.y, 6, dt);
      camera.position.z = damp(camera.position.z, pos.z, 6, dt);
      look.current.x = damp(look.current.x, lk.x, 6, dt);
      look.current.y = damp(look.current.y, lk.y, 6, dt);
      look.current.z = damp(look.current.z, lk.z, 6, dt);
    }
    camera.lookAt(look.current);
  });
  return null;
}

/** Tells the loader the scene is ready once the first frames have rendered. */
function ReadySignal() {
  const frames = useRef(0);
  useFrame(() => {
    frames.current += 1;
    if (frames.current === 3) setSceneProgress(100);
  });
  return null;
}

export default function CharacterScene({ active }: { active: boolean }) {
  useEffect(() => {
    setSceneProgress(55);
  }, []);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ fov: 32, near: 0.1, far: 30, position: [0, 1.36, 2] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <hemisphereLight args={["#ffffff", "#2a1838", 0.85]} />
      <directionalLight position={[1.5, 3, 4]} intensity={2.1} color="#ffffff" />
      <directionalLight position={[-2.5, 0.5, 2]} intensity={0.5} color="#e8dcff" />
      {/* Purple and pink rim lights from behind */}
      <directionalLight position={[-3, 2.2, -3]} intensity={7} color="#a860ff" />
      <directionalLight position={[3, 1.4, -2.5]} intensity={5} color="#ff6ed1" />
      <pointLight position={[0, 0.9, -1.2]} intensity={6} distance={4} color="#8b4dff" />
      <CameraRig />
      <Character />
      <ReadySignal />
    </Canvas>
  );
}
