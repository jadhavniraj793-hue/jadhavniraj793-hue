import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { FileText, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { navLinks, profile } from '../data/content';
import { cn, resumePdfUrl } from '../utils/cn';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');
  const [open, setOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-42% 0px -52% 0px' },
    );
    navLinks.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-violet-500 via-sky-400 to-cyan-300"
      />
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[60] transition-all duration-500',
          scrolled ? 'glass-strong shadow-card' : 'bg-transparent',
        )}
      >
        <nav className="section-shell flex h-16 items-center justify-between lg:h-[72px]">
          <a href="#home" className="group flex items-center gap-3" aria-label="Home">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 font-display text-sm font-bold text-white shadow-glow-sm transition-transform duration-300 group-hover:scale-105">
              {profile.initials}
            </span>
            <span className="font-display text-sm font-semibold tracking-[0.18em] text-white sm:text-base">
              {profile.displayName}
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={cn(
                    'relative rounded-full px-3.5 py-2 text-[13px] font-medium tracking-wide transition-colors duration-300',
                    active === id ? 'text-white' : 'text-slate-400 hover:text-slate-100',
                  )}
                >
                  {active === id && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                      className="absolute inset-0 rounded-full border border-violet-400/25 bg-violet-500/10"
                    />
                  )}
                  <span className="relative">{label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href={resumePdfUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-[13px] font-semibold text-violet-200 transition-all duration-300 hover:border-violet-400/60 hover:bg-violet-500/20 hover:text-white sm:inline-flex"
            >
              <FileText size={14} />
              Resume
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-200 transition-colors hover:border-violet-400/40 lg:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
              className="glass-strong overflow-hidden border-t border-white/5 lg:hidden"
            >
              <ul className="section-shell flex flex-col gap-1 py-4">
                {navLinks.map(({ id, label }, i) => (
                  <motion.li
                    key={id}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <a
                      href={`#${id}`}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'block rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                        active === id
                          ? 'bg-violet-500/15 text-white'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white',
                      )}
                    >
                      {label}
                    </a>
                  </motion.li>
                ))}
                <li className="pt-2">
                  <a
                    href={resumePdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white"
                  >
                    <FileText size={15} />
                    View Resume
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
