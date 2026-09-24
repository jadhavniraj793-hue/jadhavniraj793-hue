import { motion } from 'framer-motion';
import {
  Activity,
  BarChart3,
  Boxes,
  Briefcase,
  Code,
  Database,
  FileSpreadsheet,
  Filter,
  LayoutGrid,
  LineChart,
  PieChart,
  Search,
  Table,
  TrendingUp,
  Waves,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import { skills } from '../data/content';
import { TiltCard } from './ui/TiltCard';
import { SectionHeading } from './ui/SectionHeading';
import { Counter } from './ui/Counter';

const iconMap: Record<string, LucideIcon> = {
  FileSpreadsheet,
  Table,
  Database,
  Code,
  LayoutGrid,
  Boxes,
  LineChart,
  Waves,
  BarChart3,
  PieChart,
  Filter,
  Workflow,
  Search,
  Activity,
  TrendingUp,
  Briefcase,
};

const RING_R = 26;
const RING_C = 2 * Math.PI * RING_R;

function SkillCard({ index, name, category, level, color, icon }: {
  index: number;
  name: string;
  category: string;
  level: number;
  color: string;
  icon: string;
}) {
  const Icon = iconMap[icon] ?? Activity;
  const floatOffset = index % 2 === 0 ? 'lg:translate-y-0' : 'lg:translate-y-7';

  return (
    <motion.div
      initial={{ opacity: 0, y: 42, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay: (index % 4) * 0.08, ease: [0.21, 0.65, 0.35, 1] }}
      className={floatOffset}
    >
      <TiltCard intensity={10} className="rounded-2xl">
        <div className="glass relative h-full overflow-hidden rounded-2xl p-5 transition-all duration-500 group-hover:border-white/20 group-hover:shadow-glow-sm">
          {/* corner glow */}
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-25 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
            style={{ background: color }}
          />

          <div className="relative flex items-start justify-between">
            <div className="relative h-[62px] w-[62px]">
              {/* decorative progress ring — visual design element only */}
              <svg viewBox="0 0 62 62" className="absolute inset-0 h-full w-full -rotate-90">
                <circle cx="31" cy="31" r={RING_R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3" />
                <motion.circle
                  cx="31"
                  cy="31"
                  r={RING_R}
                  fill="none"
                  stroke={color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={RING_C}
                  initial={{ strokeDashoffset: RING_C }}
                  whileInView={{ strokeDashoffset: RING_C * (1 - level / 100) }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, delay: 0.3, ease: 'easeOut' }}
                  style={{ filter: `drop-shadow(0 0 5px ${color}88)` }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                  style={{ color }}
                >
                  <Icon size={19} />
                </span>
              </span>
            </div>
            <span className="font-mono text-[11px] font-medium text-slate-500 transition-colors duration-500 group-hover:text-slate-300">
              <Counter to={level} suffix="%" />
            </span>
          </div>

          <h3 className="relative mt-4 font-display text-[15px] font-semibold text-white">{name}</h3>
          <p className="relative mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
            {category}
          </p>

          <div className="relative mt-4 h-1 overflow-hidden rounded-full bg-white/8">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: level / 100 }}
              viewport={{ once: true }}
              transition={{ duration: 1.3, delay: 0.35, ease: 'easeOut' }}
              className="h-full origin-left rounded-full"
              style={{ background: `linear-gradient(90deg, ${color}55, ${color})`, boxShadow: `0 0 12px ${color}66` }}
            />
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
      <div className="pointer-events-none absolute -left-32 bottom-24 h-[400px] w-[400px] rounded-full bg-cyan-500/8 blur-[140px]" />

      <div className="section-shell">
        <SectionHeading
          eyebrow="Capabilities"
          title={
            <>
              The Skills <span className="text-gradient">Ecosystem</span>
            </>
          }
          description="An interactive constellation of the tools and techniques I use to turn raw data into clear decisions."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((s, i) => (
            <SkillCard key={s.name} index={i} {...s} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mx-auto mt-12 max-w-2xl text-center text-xs leading-relaxed text-slate-600"
        >
          * Percentages and rings above are decorative UI elements for visual rhythm only — they are not
          certifications or measured proficiency levels.
        </motion.p>
      </div>
    </section>
  );
}
