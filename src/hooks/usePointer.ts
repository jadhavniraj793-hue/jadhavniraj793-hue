import { useEffect, useRef } from 'react';

export type PointerRef = { x: number; y: number };

/**
 * Normalised pointer position (-1 … 1) kept in a ref so 3D scenes can read it
 * every frame without triggering React re-renders.
 */
export function usePointer(): React.RefObject<PointerRef> {
  const pointer = useRef<PointerRef>({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return pointer;
}
