'use client';

import { motion } from 'framer-motion';
import { Activity, Database, Gauge } from 'lucide-react';
import { TiltCard } from '../ui/TiltCard';

/* ---------- Tiny inline data-visuals (pure SVG, no library) ---------- */

function MiniBars() {
  const bars = [0.35, 0.6, 0.42, 0.78, 0.52, 0.92, 0.68, 0.8];
  return (
    <div className="flex h-9 items-end gap-1">
      {bars.map((height, i) => (
        <motion.span
          key={i}
          initial={{ scaleY: 0.15 }}
          animate={{ scaleY: [height * 0.55, height, height * 0.7, height] }}
          transition={{
            duration: 4.5,
            times: [0, 0.35, 0.6, 1],
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.12,
          }}
          style={{ transformOrigin: 'bottom' }}
          className={`w-1.5 rounded-sm ${
            i % 3 === 0
              ? 'bg-gradient-to-t from-violet-core to-violet-glow'
              : 'bg-gradient-to-t from-aqua-deep to-aqua'
          }`}
        />
      ))}
    </div>
  );
}

function MiniSpark() {
  return (
    <svg viewBox="0 0 120 36" className="h-9 w-full" aria-hidden>
      <defs>
        <linearGradient id="hud-spark" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00f5d4" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="hud-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00f5d4" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#00f5d4" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d="M2 30 L16 24 L30 27 L44 16 L58 20 L72 10 L86 14 L100 6 L118 9"
        fill="none"
        stroke="url(#hud-spark)"
        strokeWidth="1.6"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      />
      <path
        d="M2 30 L16 24 L30 27 L44 16 L58 20 L72 10 L86 14 L100 6 L118 9 L118 36 L2 36 Z"
        fill="url(#hud-fill)"
      />
    </svg>
  );
}

function MiniDonut({ value = 0.92 }: { value?: number }) {
  const circumference = 2 * Math.PI * 16;
  return (
    <svg viewBox="0 0 40 40" className="h-10 w-10" aria-hidden>
      <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="3" />
      <motion.circle
        cx="20"
        cy="20"
        r="16"
        fill="none"
        stroke="#00f5d4"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        whileInView={{ strokeDashoffset: circumference * (1 - value) }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        transform="rotate(-90 20 20)"
      />
      <text
        x="20"
        y="23"
        textAnchor="middle"
        className="fill-mist font-mono"
        style={{ fontSize: 9, fontWeight: 600 }}
      >
        {Math.round(value * 100)}%
      </text>
    </svg>
  );
}

/* ---------- Floating cards ---------- */

const CARDS = [
  {
    id: 'rows',
    Icon: Database,
    label: 'Rows processed',
    value: '2.4M',
    hint: 'cleaned & modelled',
    position: 'right-[4%] top-[18%] xl:right-[7%]',
    float: 9,
    delay: 0,
    visual: <MiniBars />,
  },
  {
    id: 'latency',
    Icon: Gauge,
    label: 'Insight latency',
    value: '0.42s',
    hint: 'query → visual',
    position: 'right-[24%] bottom-[24%] xl:right-[28%]',
    float: 12,
    delay: 0.5,
    visual: <MiniSpark />,
  },
  {
    id: 'quality',
    Icon: Activity,
    label: 'Data quality',
    value: '99.2%',
    hint: 'validated records',
    position: 'right-[6%] bottom-[9%] xl:right-[10%]',
    float: 10,
    delay: 1,
    visual: <MiniDonut value={0.92} />,
  },
] as const;

/**
 * Glass "telemetry" cards that float above the 3D scene on large screens,
 * reinforcing the analytics narrative without blocking the canvas.
 */
export function HeroHud() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
      {CARDS.map((card) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 26, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.6 + card.delay * 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute w-[228px] ${card.position}`}
        >
          <motion.div
            animate={{ y: [0, -card.float, 0] }}
            transition={{
              duration: 6 + card.delay,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: card.delay,
            }}
            className="pointer-events-auto"
          >
            <TiltCard intensity={7} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-ash">
                    <card.Icon className="h-3.5 w-3.5 text-aqua" strokeWidth={1.9} />
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
                      {card.label}
                    </span>
                  </div>
                  <p className="mt-1.5 font-display text-2xl font-bold text-mist">{card.value}</p>
                  <p className="font-mono text-[10px] text-aqua/70">{card.hint}</p>
                </div>
                <div className="mt-1 shrink-0">{card.visual}</div>
              </div>
            </TiltCard>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
