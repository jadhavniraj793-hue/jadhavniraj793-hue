import { SceneCanvas } from './SceneCanvas';
import { DataCubes, NodeNetwork, Particles, StudioLights } from './elements';
import { useQuality } from '../../hooks/useQuality';

/** Ambient data field that sits behind the contact panel. */
export default function ContactScene() {
  const quality = useQuality();
  return (
    <SceneCanvas cameraPosition={[0, 0, 8]} fov={50} eventsEnabled={false}>
      <StudioLights />
      <Particles count={Math.round(quality.particles * 0.7)} radius={11} speed={0.8} />
      <NodeNetwork count={quality.tier === 'low' ? 8 : 14} radius={3.6} />
      <DataCubes count={quality.tier === 'low' ? 3 : 6} spread={6} />
    </SceneCanvas>
  );
}
