"use client";

import { useEffect, useRef, useMemo, useState, createContext, useContext, useCallback } from "react";
import {
  Vector3,
  EllipseCurve,
  BufferGeometry,
  Line,
  Group,
  Matrix4,
  DoubleSide,
  Color,
} from "three";
import { useThree, Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Line as DreiLine } from "@react-three/drei";

/* ── Types ─────────────────────────────────────────────────────────── */

export interface WireframeGlobeConfig {
  radius?: number;
  meridianCount?: number;
  parallelCount?: number;
  wireframeColor?: string;
  wireframeOpacity?: number;
  meridianDashSize?: number;
  meridianGapSize?: number;
  parallelDashSize?: number;
  parallelGapSize?: number;
  lineWidth?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
}

/* ── FlyTo context ─────────────────────────────────────────────────── */

type FlyToFn = (lat: number, lng: number) => void;
const GlobeFlyToContext = createContext<FlyToFn>(() => {});
export const useGlobeFlyTo = () => useContext(GlobeFlyToContext);

/* ── Helpers ───────────────────────────────────────────────────────── */

export function latLngToVector3(lat: number, lng: number, radius: number): Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

/* ── Orange dot ────────────────────────────────────────────────────── */

export function GlobeDot({ lat, lng, radius }: { lat: number; lng: number; radius: number }) {
  const position = useMemo(() => latLngToVector3(lat, lng, radius + 0.5), [lat, lng, radius]);
  const groupRef = useRef<Group>(null);
  const ringRef = useRef<any>(null);
  const dotMatRef = useRef<any>(null);
  const ringMatRef = useRef<any>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;
    if (ringRef.current) ringRef.current.lookAt(camera.position);
    const worldPos = position.clone();
    if (groupRef.current.parent) groupRef.current.parent.localToWorld(worldPos);
    // Use camera look direction for correct fade regardless of orbit orientation
    const camDir = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    const toOverlay = worldPos.clone().normalize();
    const facing = -toOverlay.dot(camDir);
    const fadeStart = -0.3;
    const fadeEnd = 0.6;
    const t = Math.max(0, Math.min(1, (facing - fadeStart) / (fadeEnd - fadeStart)));
    const eased = t * t * (3 - 2 * t); // smoothstep
    groupRef.current.visible = eased > 0.01;
    if (dotMatRef.current) { dotMatRef.current.opacity = eased; dotMatRef.current.transparent = true; }
    if (ringMatRef.current) { ringMatRef.current.opacity = eased * 0.5; }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <sphereGeometry args={[0.8, 12, 12]} />
        <meshBasicMaterial ref={dotMatRef} color="#FF8003" transparent opacity={1} />
      </mesh>
      <mesh ref={ringRef}>
        <ringGeometry args={[1.4, 1.8, 24]} />
        <meshBasicMaterial ref={ringMatRef} color="#FF8003" transparent opacity={0.5} side={DoubleSide} />
      </mesh>
    </group>
  );
}

/* ── Animated arc ──────────────────────────────────────────────────── */

export function AnimatedGlobeArc({
  startLat, startLng, endLat, endLng, radius,
  arcHeight = 0.12, color = "#FF8F00", delay = 0,
}: {
  startLat: number; startLng: number;
  endLat: number; endLng: number;
  radius: number;
  arcHeight?: number;
  color?: string;
  delay?: number;
}) {
  const lineRef = useRef<Line>(null);
  const startTime = useRef<number | null>(null);

  const points = useMemo(() => {
    const start = latLngToVector3(startLat, startLng, radius);
    const end = latLngToVector3(endLat, endLng, radius);
    const result: Vector3[] = [];
    for (let i = 0; i <= 80; i++) {
      const t = i / 80;
      const point = new Vector3().lerpVectors(start, end, t);
      point.normalize().multiplyScalar(radius * (1 + arcHeight * Math.sin(Math.PI * t)));
      result.push(point);
    }
    return result;
  }, [startLat, startLng, endLat, endLng, radius, arcHeight]);

  useEffect(() => {
    if (!lineRef.current) return;
    (lineRef.current.geometry as BufferGeometry).setFromPoints(points);
    lineRef.current.geometry.setDrawRange(0, 0);
  }, [points]);

  useFrame((state) => {
    if (!lineRef.current) return;
    const time = state.clock?.getElapsedTime?.() ?? performance.now() / 1000;
    if (startTime.current === null) startTime.current = time;
    const elapsed = time - startTime.current - delay;

    const mid = points[40].clone();
    if (lineRef.current.parent?.parent) lineRef.current.parent.parent.localToWorld(mid);
    const camDir = new Vector3(0, 0, -1).applyQuaternion(state.camera.quaternion);
    lineRef.current.visible = -mid.normalize().dot(camDir) > -0.1;

    if (elapsed < 0 || !lineRef.current.visible) return;
    const cycle = elapsed % 5.5;
    if (cycle < 2.5) {
      const p = 1 - Math.pow(1 - cycle / 2.5, 3);
      lineRef.current.geometry.setDrawRange(0, Math.floor(p * points.length));
      (lineRef.current.material as any).opacity = 0.8;
    } else if (cycle < 4.5) {
      lineRef.current.geometry.setDrawRange(0, points.length);
      (lineRef.current.material as any).opacity = 0.8;
    } else {
      lineRef.current.geometry.setDrawRange(0, points.length);
      (lineRef.current.material as any).opacity = 0.8 * (1 - (cycle - 4.5));
    }
  });

  return (
    <line ref={lineRef as any}>
      <bufferGeometry />
      <lineBasicMaterial color={color} transparent opacity={0} depthWrite={false} />
    </line>
  );
}

/* ── Html overlay ──────────────────────────────────────────────────── */

export function GlobeOverlay({
  lat, lng, radius, children, offsetY = 0, interactive = true,
}: {
  lat: number; lng: number; radius: number;
  children: React.ReactNode;
  offsetY?: number;
  interactive?: boolean;
}) {
  const position = useMemo(() => latLngToVector3(lat, lng, radius + 4), [lat, lng, radius]);
  const ref = useRef<HTMLDivElement>(null);
  const { camera } = useThree();
  const flyTo = useGlobeFlyTo();
  // drei's Html forwards ref to a DOM div, not the Three.js Group,
  // so we use a sibling <group> to get the correct world transform.
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    const worldPos = new Vector3(position.x, position.y + offsetY, position.z);
    if (groupRef.current?.parent) {
      groupRef.current.parent.localToWorld(worldPos);
    }
    // Use camera look direction for correct fade regardless of orbit orientation
    const camDir = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    const toOverlay = worldPos.clone().normalize();
    const facing = -toOverlay.dot(camDir);
    const fadeStart = -0.3;
    const fadeEnd = 0.6;
    const t = Math.max(0, Math.min(1, (facing - fadeStart) / (fadeEnd - fadeStart)));
    const eased = t * t * (3 - 2 * t); // smoothstep
    ref.current.style.opacity = String(eased);
    ref.current.style.pointerEvents = eased > 0.1 ? "auto" : "none";
  });

  const bringToFront = useCallback((el: HTMLElement) => {
    // Walk up to the Html root div (positioned by drei) and bump z-index
    let node: HTMLElement | null = el;
    while (node && !node.style.transform?.includes("translate3d")) {
      node = node.parentElement;
    }
    if (node) node.style.zIndex = "100";
  }, []);

  const resetZ = useCallback((el: HTMLElement) => {
    let node: HTMLElement | null = el;
    while (node && !node.style.transform?.includes("translate3d")) {
      node = node.parentElement;
    }
    if (node) node.style.zIndex = "1";
  }, []);

  return (
    <>
      <group ref={groupRef} position={[position.x, position.y + offsetY, position.z]} />
      <Html
        position={[position.x, position.y + offsetY, position.z]}
        center
        distanceFactor={220}
        zIndexRange={[100, 0]}
        style={{ whiteSpace: "nowrap", userSelect: "none" }}
      >
        <div
          ref={ref}
          onClick={() => interactive && flyTo?.(lat, lng)}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px) scale(1.05)"; bringToFront(e.currentTarget); }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; resetZ(e.currentTarget); }}
          style={{ transition: "transform 0.2s ease-out", cursor: interactive ? "pointer" : "default", pointerEvents: "none" }}
        >
          {children}
        </div>
      </Html>
    </>
  );
}

/* ── CulledLine — drei Line with shader-based back-face fade ────────── */

function CulledLine({ points, color, lineWidth, opacity, dashed, dashSize, gapSize }: {
  points: [number, number, number][];
  color: Color;
  lineWidth: number;
  opacity: number;
  dashed: boolean;
  dashSize: number;
  gapSize: number;
}) {
  const lineRef = useRef<any>(null);
  const patched = useRef(false);

  useFrame(({ camera }) => {
    if (!lineRef.current?.material || patched.current) return;
    const mat = lineRef.current.material;
    mat.transparent = true;
    mat.depthWrite = false;

    mat.onBeforeCompile = (shader: any) => {
      shader.uniforms.uCameraPos = { value: camera.position };
      shader.vertexShader = shader.vertexShader.replace(
        "void main() {",
        `varying vec3 vWorldPos;
void main() {`
      );
      shader.vertexShader = shader.vertexShader.replace(
        "#include <fog_vertex>",
        `#include <fog_vertex>
vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;`
      );
      shader.fragmentShader = `uniform vec3 uCameraPos;\nvarying vec3 vWorldPos;\n` + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        "gl_FragColor = vec4( diffuseColor.rgb, alpha );",
        `vec3 norm = normalize(vWorldPos);
vec3 camDir = normalize(uCameraPos);
float facing = dot(norm, camDir);
if (facing < -0.05) discard;
float f = smoothstep(-0.05, 0.05, facing);
gl_FragColor = vec4( 1.0, 1.0, 1.0, f );`
      );
    };
    mat.needsUpdate = true;
    patched.current = true;
  });

  useFrame(({ camera }) => {
    if (!lineRef.current?.material?.uniforms?.uCameraPos) return;
    lineRef.current.material.uniforms.uCameraPos.value.copy(camera.position);
  });

  return (
    <DreiLine
      ref={lineRef}
      points={points}
      color={color}
      lineWidth={lineWidth}
      opacity={opacity}
      transparent
      dashed={dashed}
      dashSize={dashSize}
      gapSize={gapSize}
      depthWrite={false}
    />
  );
}

/* ── Wireframe sphere ──────────────────────────────────────────────── */

export function WireframeSphere({ config }: { config: WireframeGlobeConfig }) {
  const {
    radius = 100,
    meridianCount = 8,
    parallelCount = 8,
    wireframeColor = "#FFFFFF",
    wireframeOpacity = 1,
    meridianDashSize = 2,
    meridianGapSize = 3,
    parallelDashSize = 2,
    parallelGapSize = 3,
    lineWidth = 1.5,
  } = config;

  const circles = useMemo(() => {
    const result: { points: [number, number, number][]; dash: number; gap: number }[] = [];
    const segments = 120;
    const poleSkip = 0.04;

    for (let i = 1; i <= meridianCount; i++) {
      const t = poleSkip + (i / (meridianCount + 1)) * (1 - 2 * poleSkip);
      const lat = t * Math.PI;
      const r = radius * Math.sin(lat);
      const x = radius * Math.cos(lat);
      const curve = new EllipseCurve(0, 0, r, r, 0, 2 * Math.PI, false, 0);
      const pts = curve.getPoints(segments);
      result.push({ points: pts.map((p) => [x, p.x, p.y] as [number, number, number]), dash: meridianDashSize, gap: meridianGapSize });
    }

    for (let i = 1; i <= parallelCount; i++) {
      const t = poleSkip + (i / (parallelCount + 1)) * (1 - 2 * poleSkip);
      const lat = t * Math.PI;
      const r = radius * Math.sin(lat);
      const y = radius * Math.cos(lat);
      const curve = new EllipseCurve(0, 0, r, r, 0, 2 * Math.PI, false, 0);
      const pts = curve.getPoints(segments);
      result.push({ points: pts.map((p) => [p.x, y, p.y] as [number, number, number]), dash: parallelDashSize, gap: parallelGapSize });
    }

    return result;
  }, [radius, meridianCount, parallelCount, meridianDashSize, meridianGapSize, parallelDashSize, parallelGapSize]);

  const color = useMemo(() => new Color(wireframeColor), [wireframeColor]);

  return (
    <group>
      {circles.map((c, i) => (
        <CulledLine
          key={i}
          points={c.points}
          color={color}
          lineWidth={lineWidth}
          opacity={wireframeOpacity}
          dashed
          dashSize={c.dash}
          gapSize={c.gap}
        />
      ))}
    </group>
  );
}

/* ── Rotation controller ──────────────────────────────────────────── */

function GlobeRotationController({ groupRef, flyTarget }: {
  groupRef: React.RefObject<Group | null>;
  flyTarget: React.MutableRefObject<{ targetY: number } | null>;
}) {
  const { gl } = useThree();
  const isDragging = useRef(false);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const baseSpeed = 0.002;
  const hoverInfluence = useRef(0);
  const targetInfluence = useRef(0);

  useEffect(() => {
    const el = gl.domElement;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const normalized = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetInfluence.current = normalized * 0.6;
    };
    const onLeave = () => {
      targetInfluence.current = 0;
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    const onScroll = () => {
      isScrolling.current = true;
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => { isScrolling.current = false; }, 300);
    };
    const onDown = () => { isDragging.current = true; };
    const onUp = () => { isDragging.current = false; };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [gl]);

  useFrame(() => {
    if (!groupRef.current || isDragging.current) return;

    // Smoothly interpolate hover influence
    hoverInfluence.current += (targetInfluence.current - hoverInfluence.current) * 0.05;

    if (flyTarget.current) {
      const current = groupRef.current.rotation.y;
      let diff = flyTarget.current.targetY - current;
      while (diff > Math.PI) diff -= 2 * Math.PI;
      while (diff < -Math.PI) diff += 2 * Math.PI;
      groupRef.current.rotation.y += diff * 0.06;
      if (Math.abs(diff) < 0.01) {
        flyTarget.current = null;
      }
      return;
    }

    // Base rotation + hover-influenced shift
    const speed = baseSpeed + hoverInfluence.current * 0.003;
    groupRef.current.rotation.y += speed;
  });

  return null;
}

/* ── Renderer config ───────────────────────────────────────────────── */

export function GlobeRendererConfig() {
  const { gl, size } = useThree();
  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0x000000, 0);
  }, [gl, size]);
  return null;
}

/* ── Scene wrapper ─────────────────────────────────────────────────── */

export function GlobeScene({
  config,
  children,
  cameraZ = 310,
  tilt = 0,
}: {
  config: WireframeGlobeConfig;
  children: React.ReactNode;
  cameraZ?: number;
  tilt?: number;
}) {
  const controlsRef = useRef<any>(null);
  const flyTarget = useRef<{ targetY: number } | null>(null);
  const globeGroupRef = useRef<Group>(null);

  const flyCooldown = useRef(0);

  const flyTo: FlyToFn = useCallback((lat, lng) => {
    if (flyTarget.current || Date.now() < flyCooldown.current) return;
    const pos = latLngToVector3(lat, lng, 1);
    flyTarget.current = { targetY: Math.atan2(pos.x, pos.z) };
    flyCooldown.current = Date.now() + 2000;
  }, []);

  const startPos = useMemo(() => {
    const p = latLngToVector3(80, 30, 1).normalize().multiplyScalar(cameraZ);
    return [p.x, p.y, p.z] as [number, number, number];
  }, [cameraZ]);

  return (
    <Canvas
      camera={{ fov: 50, near: 1, far: 1800, position: startPos }}
      style={{ background: "transparent", cursor: "grab" }}
      onPointerDown={(e) => { (e.target as HTMLElement).style.cursor = "grabbing"; }}
      onPointerUp={(e) => { (e.target as HTMLElement).style.cursor = "grab"; }}
      gl={{ alpha: true, antialias: true }}
    >
      <GlobeRendererConfig />
      <ambientLight color="#FFFFFF" intensity={1} />

      <GlobeFlyToContext.Provider value={flyTo}>
        <GlobeRotationController groupRef={globeGroupRef} flyTarget={flyTarget} />
        <group rotation={[0, 0, tilt]}>
          <group ref={globeGroupRef}>
            <WireframeSphere config={config} />
            {children}
          </group>
        </group>
      </GlobeFlyToContext.Provider>
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={false}
        enableRotate={true}
        rotateSpeed={0.8}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotate={false}
        minPolarAngle={-Infinity}
        maxPolarAngle={Infinity}
        enableDamping={true}
        dampingFactor={0.1}
      />
    </Canvas>
  );
}
