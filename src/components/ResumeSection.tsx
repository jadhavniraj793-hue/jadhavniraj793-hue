import { motion } from 'framer-motion';
import { Download, Eye, FileText } from 'lucide-react';
import { resumePdfUrl } from '../utils/cn';
import { useHasHover } from '../hooks/useMediaQuery';

export function ResumeSection() {
  const canHover = useHasHover();

  return (
    <section id="resume" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 44 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-90px' }}
          transition={{ duration: 0.8, ease: [0.21, 0.65, 0.35, 1] }}
          className="relative mx-auto max-w-4xl overflow-hidden rounded-[32px]"
        >
          {/* glow frame */}
          <div className="pointer-events-none absolute -inset-px rounded-[32px] bg-gradient-to-br from-violet-500/30 via-transparent to-cyan-400/30" />
          <div className="glass-strong relative overflow-hidden rounded-[32px] p-8 text-center shadow-card sm:p-12">
            <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-violet-500/14 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-cyan-400/12 blur-3xl" />

            <motion.span
              animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-glow"
            >
              <FileText size={26} />
            </motion.span>

            <h2 className="relative mt-6 font-display text-3xl font-semibold text-white sm:text-4xl">
              My <span className="text-gradient">Resume</span>
            </h2>
            <p className="relative mx-auto mt-3 max-w-md text-slate-400">
              Want to know more about my skills and experience?
            </p>

            <div className="relative mt-8 flex flex-wrap justify-center gap-4">
              <a href={resumePdfUrl} target="_blank" rel="noreferrer" className="btn-primary">
                <Eye size={16} />
                View Resume
              </a>
              <a href={resumePdfUrl} download="Niraj_Jadhav_Resume.pdf" className="btn-ghost">
                <Download size={16} className="text-cyan-300" />
                Download Resume
              </a>
            </div>

            {canHover && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25, duration: 0.7 }}
                className="relative mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
              >
                <iframe
                  src={resumePdfUrl}
                  title="Resume preview — Niraj Jadhav"
                  loading="lazy"
                  className="h-[460px] w-full bg-slate-100"
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
