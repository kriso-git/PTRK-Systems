"use client";

// The three per-project signature objects, validated in the Phase C prototype.
// Each is lights-only (NO per-view <Environment>; 8 environments tanked mobile
// FPS) and respects `reduced` (one static pose, no spin/float) and `active`
// (hover: faster spin + scale up). Composited by StageViews' <View.Port/>.

import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import type { SignatureKind } from "@/lib/r3f/signature-kind";

interface ObjProps {
  accent: string;
  active: boolean;
  reduced: boolean;
}

/** MolekulaX – distorted sphere, a peptide / molecule reading. */
function DistortBlob({ accent, active, reduced }: ObjProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const sc = useRef(1);
  useFrame((_, d) => {
    const m = mesh.current;
    if (!m || reduced) return;
    const s = active ? 0.9 : 0.28;
    m.rotation.y += d * s;
    m.rotation.x += d * s * 0.45;
    sc.current = THREE.MathUtils.damp(sc.current, active ? 1.12 : 1, 6, d);
    m.scale.setScalar(sc.current);
  });
  return (
    <mesh ref={mesh} rotation={[0.4, 0.6, 0]}>
      <sphereGeometry args={[1, 48, 48]} />
      <MeshDistortMaterial
        color={accent}
        emissive={accent}
        emissiveIntensity={0.6}
        roughness={0.2}
        metalness={0.2}
        distort={reduced ? 0.28 : active ? 0.42 : 0.3}
        speed={reduced ? 0 : active ? 2.4 : 1.3}
      />
    </mesh>
  );
}

/** Donna – glossy metallic torus knot (transmission needs an env to refract,
 *  which we deliberately avoid, so this is an emissive-tinted metal instead). */
function MetalKnot({ accent, active, reduced }: ObjProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const sc = useRef(1);
  useFrame((_, d) => {
    const m = mesh.current;
    if (!m || reduced) return;
    const s = active ? 0.85 : 0.25;
    m.rotation.x += d * s;
    m.rotation.y += d * s * 0.6;
    sc.current = THREE.MathUtils.damp(sc.current, active ? 1.12 : 1, 6, d);
    m.scale.setScalar(sc.current);
  });
  return (
    <mesh ref={mesh} rotation={[0.5, 0.3, 0]}>
      <torusKnotGeometry args={[0.72, 0.26, 140, 20]} />
      <meshStandardMaterial
        color={accent}
        emissive={accent}
        emissiveIntensity={0.5}
        roughness={0.08}
        metalness={0.85}
      />
    </mesh>
  );
}

/** F3XYKEE – glowing core inside a wireframe icosahedron, a HUD lattice. */
function WireIco({ accent, active, reduced }: ObjProps) {
  const group = useRef<THREE.Group>(null);
  const sc = useRef(1);
  useFrame((_, d) => {
    const g = group.current;
    if (!g || reduced) return;
    const s = active ? 0.95 : 0.3;
    g.rotation.y += d * s;
    g.rotation.x += d * s * 0.5;
    sc.current = THREE.MathUtils.damp(sc.current, active ? 1.14 : 1, 6, d);
    g.scale.setScalar(sc.current);
  });
  return (
    <group ref={group} rotation={[0.3, 0.5, 0]}>
      <mesh scale={0.62}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={1.4}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial color={accent} wireframe transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

function SignatureLights({ accent }: { accent: string }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} color="#ffffff" />
      <pointLight position={[-3, -2, -2]} intensity={1.6} color={accent} />
    </>
  );
}

export function Signature({
  kind,
  accent,
  active,
  reduced,
}: { kind: SignatureKind } & ObjProps) {
  const obj =
    kind === "distort" ? (
      <DistortBlob accent={accent} active={active} reduced={reduced} />
    ) : kind === "knot" ? (
      <MetalKnot accent={accent} active={active} reduced={reduced} />
    ) : (
      <WireIco accent={accent} active={active} reduced={reduced} />
    );
  return (
    <>
      <Float
        speed={reduced ? 0 : active ? 2.2 : 1.1}
        rotationIntensity={reduced ? 0 : 0.4}
        floatIntensity={reduced ? 0 : active ? 0.9 : 0.5}
      >
        {obj}
      </Float>
      <SignatureLights accent={accent} />
    </>
  );
}
