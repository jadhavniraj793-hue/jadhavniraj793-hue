'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Award, BadgeCheck, RotateCw } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { certifications, sectionMeta, type Certification } from '@/lib/data';
import { Chip, SectionShell } from '../ui/SectionShell';
import { RevealGroup, fadeUp } from '../ui/Reveal';

const TONES: Record<Certification['accent'], { ring: string; icon: string; hex: string }> = {
  cyan: { ring: 'hover:border-aqua/45', icon: 'text-aqua border-aqua/25 bg-aqua/10', hex: '#00f5d4' },
  violet: {
    ring: 'hover:border-violet-glow/45',
    icon: 'text-violet-glow border-violet-glow/25 bg-violet-core/15',
    hex: '#8b5cf6',
  },
  mixed: {
    ring: 'hover:border-plasma/45',
    icon: 'text-plasma border-plasma/25 bg-plasma/10',
    hex: '#22d3ee',
  },
};

/** CSS-3D flip badge: flips on hover (fine pointers) and on tap/Enter. */
function CertCard({ cert }: { cert: Certification }) {
  const [flipped, setFlipped] = useState(false);
  const reduced = useReducedMotion();
  const lastPointer = useRef<'mouse' | 'other'>('other');
  const tone = TONES[cert.accent];

  const toggle = useCallback(() => setFlipped((value) => !value), []);

  // Hover drives the flip on mouse; click/keyboard drive it everywhere else,
  // so the two inputs never fight each other.
  const handleClick = useCallback(() => {
    if (lastPointer.current === 'mouse') return;
    toggle();
  }, [toggle]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`${cert.title} issued by ${cert.issuer}. Activate to ${flipped ? 'hide' : 'show'} details.`}
      onClick={handleClick}
      onPointerDown={(event) => {
        lastPointer.current = event.pointerType === 'mouse' ? 'mouse' : 'other';
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggle();
        }
      }}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse' && !reduced) setFlipped(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse' && !reduced) setFlipped(false);
      }}
      className="h-[248px] cursor-pointer rounded-3xl outline-none [perspective:1400px] focus-visible:ring-2 focus-visible:ring-aqua/70"
    >
      <div
        className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d]"
        style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* ---------- Front ---------- */}
        <div
          className={`absolute inset-0 flex flex-col rounded-3xl glass p-6 transition-colors duration-500 [backface-visibility:hidden] ${tone.ring}`}
        >
          <div className="flex items-start justify-between">
            <span
              className={`grid h-12 w-12 place-items-center rounded-2xl border ${tone.icon}`}
            >
              <Award className="h-5.5 w-5.5" strokeWidth={1.8} />
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ash">
              <BadgeCheck className="h-3 w-3 text-aqua" strokeWidth={2} />
              certified
            </span>
          </div>

          <h3 className="mt-5 font-display text-[17px] font-semibold leading-snug text-mist">
            {cert.title}
          </h3>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ash">
            {cert.issuer}
          </p>

          <div className="mt-auto flex items-center justify-between pt-4">
            <span className="flex flex-wrap gap-1.5">
              {cert.skills.slice(0, 2).map((skill) => (
                <Chip key={skill} tone="slate">
                  {skill}
                </Chip>
              ))}
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-ash-dim">
              <RotateCw className="h-3 w-3" strokeWidth={2} />
              flip
            </span>
          </div>
        </div>

        {/* ---------- Back ---------- */}
        <div
          className="absolute inset-0 flex flex-col rounded-3xl border border-white/10 p-6 [backface-visibility:hidden]"
          style={{
            transform: 'rotateY(180deg)',
            background: `linear-gradient(150deg, ${cert.accent === 'violet' ? 'rgba(123,44,191,0.22)' : 'rgba(0,245,212,0.16)'}, rgba(10,15,29,0.92))`,
          }}
        >
          <span
            className="font-mono text-[10px] uppercase tracking-[0.24em]"
            style={{ color: tone.hex }}
          >
            skills unlocked
          </span>

          <p className="mt-3 text-[13px] leading-relaxed text-mist/85">{cert.focus}</p>

          <ul className="mt-4 space-y-2">
            {cert.skills.map((skill) => (
              <li key={skill} className="flex items-center gap-2 text-[12px] text-mist/90">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: tone.hex, boxShadow: `0 0 10px ${tone.hex}` }}
                />
                {skill}
              </li>
            ))}
          </ul>

          <span className="mt-auto pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
            {cert.issuer} · verified learning path
          </span>
        </div>
      </div>
    </div>
  );
}

export function Certifications() {
  const meta = sectionMeta.certifications;

  return (
    <SectionShell
      id="certifications"
      index={meta.index}
      label={meta.label}
      title={meta.title}
      kicker={meta.kicker}
    >
      <RevealGroup
        as="div"
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        staggerChildren={0.09}
        amount={0.1}
      >
        {certifications.map((cert) => (
          <motion.div key={cert.id} variants={fadeUp} className="h-full">
            <CertCard cert={cert} />
          </motion.div>
        ))}

        {/* Closing panel */}
        <motion.div variants={fadeUp} className="h-full">
          <div className="flex h-full min-h-[248px] flex-col justify-center rounded-3xl border border-dashed border-white/12 bg-white/[0.02] p-6 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-aqua/25 bg-aqua/10 text-aqua">
              <BadgeCheck className="h-5.5 w-5.5" strokeWidth={1.8} />
            </span>
            <p className="mt-4 font-display text-base font-semibold text-mist">
              5 certifications · 5 tools
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ash">
              A verified path across the modern analytics toolchain — from raw spreadsheets to
              published BI dashboards.
            </p>
          </div>
        </motion.div>
      </RevealGroup>
    </SectionShell>
  );
}
