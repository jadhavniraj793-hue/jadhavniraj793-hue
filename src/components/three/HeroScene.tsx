import { useRef, type ReactNode } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { SceneCanvas } from './SceneCanvas';
import { Bars3D, DataCubes, FloatingNumbers, GridFloor, KpiRings, LineGraph3D, NodeNetwork, Particles, StudioLights } from './elements';
import { useQuality } from '../../hooks/useQuality';
import { useIsMobile, useIsTablet } from '../../hooks/useMediaQuery';
import { usePointer } from '../../hooks/usePointer';
import type { PointerRef } from '../../hooks/usePointer';

/** Parents the whole scene and eases it toward the pointer + scroll position. */
function CameraRig({ pointer, enabled, children }: { pointer: React.RefObject<PointerRef>; enabled: boolean; children: ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame((_, delta) => {
    const k = Math.min(1, delta * 2.2);
    if (group.current && enabled) {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.current.x * 0.26, k);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.current.y * 0.16, k);
    }
    // Scroll-driven dolly: the camera drifts back and up as the hero leaves view.
    const progress = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 9 + progress * 4.5, k);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, progress * 1.8, k);
    camera.lookAt(0, progress * 0.6, 0);
  });

  return <group ref={group}>{children}</group>;
}

function HeroContent() {
  const quality = useQuality();
  const pointer = usePointer();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const animated = quality.motion > 0;
  // Push the data object to the right so it never competes with the headline.
  const offsetX = isMobile ? 0 : isTablet ? 1.6 : 2.9;
  const offsetY = isMobile ? -0.6 : 0.35;

  return (
    <>
      <StudioLights />
      <CameraRig pointer={pointer} enabled={animated}>
        <Float speed={animated ? 1.1 : 0} rotationIntensity={animated ? 0.22 : 0} floatIntensity={animated ? 0.55 : 0}>
          <group position={[offsetX, offsetY, 0]}>
            <KpiRings position={[0, 0.25, -0.6]} scale={quality.tier === 'low' ? 0.85 : 1.05} />
            <Bars3D count={quality.bars} position={[0, -1.55, 0.4]} spacing={quality.tier === 'low' ? 0.42 : 0.5} />
            <LineGraph3D position={[0, 1.55, -0.2]} points={quality.tier === 'low' ? 16 : 26} />
          </group>
        </Float>

        <group position={[offsetX * 0.75, 0, 0]}>
          <NodeNetwork count={quality.nodes} radius={quality.tier === 'low' ? 2.6 : 3.4} />
        </group>
        <DataCubes count={quality.tier === 'low' ? 4 : 8} spread={quality.tier === 'low' ? 4.5 : 6.5} />
        {quality.tier !== 'low' && <FloatingNumbers count={quality.tier === 'high' ? 7 : 5} />}
        <Particles count={quality.particles} radius={13} />
        <GridFloor y={-3.4} size={quality.tier === 'low' ? 24 : 36} divisions={quality.tier === 'low' ? 18 : 30} />
      </CameraRig>

      {quality.bloom && (
        <EffectComposer enableNormalPass={false}>
          <Bloom intensity={0.75} luminanceThreshold={0.22} luminanceSmoothing={0.85} mipmapBlur radius={0.7} />
          <Vignette eskil={false} offset={0.24} darkness={0.72} />
        </EffectComposer>
      )}
    </>
  );
}

/** Full-screen cinematic hero environment. */
export default function HeroScene() {
  return (
    <SceneCanvas cameraPosition={[0, 0, 9]} fov={48} eventsEnabled={false}>
      <HeroContent />
    </SceneCanvas>
  );
}
