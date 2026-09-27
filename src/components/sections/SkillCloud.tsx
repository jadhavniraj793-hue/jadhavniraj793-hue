import { useEffect, useMemo, useRef, useState } from 'react';
import { skillGroups } from '../../data/portfolio';
import { useIsMobile, usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import { cn } from '../../lib/utils';

type Tag = { label: string; x: number; y: number; z: number; group: string };

/**
 * GPU-cheap 3D tag sphere: real DOM text positioned with CSS transforms, so the
 * labels stay crisp and selectable while still rotating in perspective.
 */
export function SkillCloud({ onSelect, activeGroup }: { onSelect?: (group: string) => void; activeGroup?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const [hovered, setHovered] = useState<string | null>(null);

  const tags = useMemo<Tag[]>(() => {
    const all = skillGroups.flatMap((g) => g.skills.map((s) => ({ label: s.name, group: g.id })));
    const list = isMobile ? all.filter((_, i) => i % 2 === 0) : all;
    const n = list.length;
    return list.map((item, i) => {
      // Fibonacci sphere distribution keeps the labels evenly spread.
      const phi = Math.acos(-1 + (2 * i + 1) / n);
      const theta = Math.sqrt(n * Math.PI) * phi;
      return {
        ...item,
        x: Math.cos(theta) * Math.sin(phi),
        y: Math.sin(theta) * Math.sin(phi),
        z: Math.cos(phi),
      };
    });
  }, [isMobile]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const radius = isMobile ? 118 : 170;
    let rafId = 0;
    let angleX = -0.25;
    let angleY = 0;
    let velX = 0.0016;
    let velY = 0.0035;
    let pointerInside = false;
    let visible = true;

    const onPointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      velY = px * 0.012;
      velX = -py * 0.012;
    };
    const onEnter = () => (pointerInside = true);
    const onLeave = () => {
      pointerInside = false;
      velX = 0.0016;
      velY = 0.0035;
    };

    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { threshold: 0.05 });
    io.observe(el);

    const render = () => {
      if (visible) {
        if (!reduced) {
          angleX += velX;
          angleY += velY;
        }
        const sinX = Math.sin(angleX);
        const cosX = Math.cos(angleX);
        const sinY = Math.sin(angleY);
        const cosY = Math.cos(angleY);

        tags.forEach((tag, i) => {
          const node = tagRefs.current[i];
          if (!node) return;
          // rotate around Y then X
          const x1 = tag.x * cosY - tag.z * sinY;
          const z1 = tag.x * sinY + tag.z * cosY;
          const y1 = tag.y * cosX - z1 * sinX;
          const z2 = tag.y * sinX + z1 * cosX;
          const scale = 0.62 + (z2 + 1) * 0.28;
          node.style.transform = `translate3d(${x1 * radius}px, ${y1 * radius}px, 0) scale(${scale})`;
          node.style.opacity = String(0.3 + (z2 + 1) * 0.35);
          node.style.zIndex = String(Math.round((z2 + 1) * 100));
          node.style.filter = z2 < -0.35 ? 'blur(1px)' : 'none';
        });
      }
      rafId = requestAnimationFrame(render);
    };

    if (!isMobile) {
      el.addEventListener('pointermove', onPointerMove);
      el.addEventListener('pointerenter', onEnter);
      el.addEventListener('pointerleave', onLeave);
    }
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      void pointerInside;
    };
  }, [tags, reduced, isMobile]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto grid aspect-square w-full max-w-[22rem] place-items-center select-none sm:max-w-[26rem]"
      style={{ perspective: '900px' }}
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-[18%] rounded-full bg-cyan-400/5 blur-3xl" />
      <div className="pointer-events-none absolute inset-[26%] rounded-full border border-cyan-300/10" />
      <div className="pointer-events-none absolute inset-[38%] rounded-full border border-blue-400/10" />
      {tags.map((tag, i) => (
        <button
          key={`${tag.group}-${tag.label}`}
          ref={(el) => {
            tagRefs.current[i] = el;
          }}
          onMouseEnter={() => setHovered(tag.label)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onSelect?.(tag.group)}
          className={cn(
            'absolute font-mono text-[0.68rem] whitespace-nowrap transition-colors duration-300 sm:text-xs',
            activeGroup === tag.group || hovered === tag.label ? 'text-cyan-200' : 'text-ink-muted hover:text-cyan-100',
          )}
          tabIndex={-1}
        >
          {tag.label}
        </button>
      ))}
    </div>
  );
}
