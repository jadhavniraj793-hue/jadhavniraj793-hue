import { motion } from 'framer-motion';
import { BadgeCheck, Database, FileSpreadsheet, MapPin, PieChart, Table2, TrendingUp } from 'lucide-react';
import { profile } from '../data/content';
import { ProfilePhoto } from './ui/ProfilePhoto';
import { TiltCard } from './ui/TiltCard';

const coreSkills = [
  { name: 'EXCEL', icon: FileSpreadsheet, color: '#4ade80' },
  { name: 'SQL', icon: Database, color: '#60a5fa' },
  { name: 'PYTHON', icon: TrendingUp, color: '#fbbf24' },
  { name: 'POWER BI', icon: BarChartIcon, color: '#facc15' },
  { name: 'TABLEAU', icon: PieChart, color: '#f472b6' },
];

function BarChartIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M3 3v18h18" />
      <rect x="7" y="12" width="3" height="6" rx="1" />
      <rect x="12" y="8" width="3" height="10" rx="1" />
      <rect x="17" y="4" width="3" height="14" rx="1" />
    </svg>
  );
}

const strengths = [
  'Data cleaning & transformation',
  'Exploratory data analysis',
  'Dashboard creation & data storytelling',
  'Trend & pattern discovery for decisions',
];

export function About() {
  return (
    <section id="about" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="pointer-events-none absolute right-0 top-24 h-[380px] w-[380px] rounded-full bg-violet-600/10 blur-[130px]" />
      <div className="section-shell">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          {/* 3D profile card */}
          <motion.div
            initial={{ opacity: 0, y: 44, rotateY: -12 }}
            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: [0.21, 0.65, 0.35, 1] }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[40px] bg-gradient-to-br from-violet-600/16 via-transparent to-cyan-500/14 blur-2xl" />

            <TiltCard intensity={8} className="rounded-[28px]">
              <div className="glass relative overflow-hidden rounded-[28px] p-8 shadow-card">
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-500/15 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-14 h-52 w-52 rounded-full bg-cyan-500/12 blur-3xl" />

                <div className="relative flex items-center gap-5">
                  <div className="relative shrink-0">
                    <div className="absolute -inset-1 rounded-[26px] bg-gradient-to-br from-violet-500 via-indigo-400 to-cyan-400 opacity-70 blur-[6px]" />
                    <div className="relative h-24 w-24 rounded-3xl border border-white/20 shadow-glow-sm">
                      <ProfilePhoto />
                    </div>
                    <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-void">
                      <BadgeCheck size={14} className="text-cyan-300" />
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-white">{profile.fullName}</h3>
                    <p className="mt-0.5 text-sm font-medium text-gradient">{profile.role}</p>
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                      <MapPin size={12} className="text-violet-300" />
                      {profile.location}
                    </p>
                  </div>
                </div>

                <div className="relative mt-7 border-t border-white/8 pt-6">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Core Toolkit
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {coreSkills.map((s, i) => (
                      <motion.li
                        key={s.name}
                        initial={{ opacity: 0, scale: 0.7 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 220, damping: 16 }}
                        className="chip animate-float"
                        style={{ animationDelay: `${i * 0.7}s`, color: s.color }}
                      >
                        <s.icon size={12} />
                        <span className="font-mono text-[11px] font-semibold tracking-wider">{s.name}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="relative mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3.5 text-center">
                    <Table2 size={18} className="mx-auto text-cyan-300" />
                    <p className="mt-1.5 text-[11px] text-slate-400">Query · Model · Report</p>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3.5 text-center">
                    <TrendingUp size={18} className="mx-auto text-violet-300" />
                    <p className="mt-1.5 text-[11px] text-slate-400">Analyze · Visualize · Decide</p>
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* copy */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="chip mb-5 font-mono uppercase tracking-[0.22em] text-violet-300"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet-400 to-cyan-300" />
              About Me
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl"
            >
              Detail-oriented by nature,{' '}
              <span className="text-gradient">data-driven</span> by choice.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="mt-6 text-base leading-relaxed text-slate-400 sm:text-lg"
            >
              {profile.about}
            </motion.p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {strengths.map((s, i) => (
                <motion.li
                  key={s}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 + i * 0.08, duration: 0.5 }}
                  className="glass flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm text-slate-300"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/25 to-cyan-500/25 text-cyan-300">
                    <BadgeCheck size={14} />
                  </span>
                  {s}
                </motion.li>
              ))}
            </ul>

            <motion.blockquote
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-8 border-l-2 border-violet-400/50 pl-5 font-display text-lg italic text-slate-300"
            >
              “{profile.headline}”
            </motion.blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
