import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Menu, X, FileDown } from 'lucide-react';
import { GithubIcon } from '../ui/BrandIcons';
import { navItems, profile } from '../../data/portfolio';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { cn } from '../../lib/utils';
import { scrollToId } from '../../lib/scroll';

const sectionIds = navItems.map((n) => n.id);

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(sectionIds);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useLockBodyScroll(open);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      return;
    }
    scrollToId(id);
  };

  return (
    <>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-cyan-300 focus:px-4 focus:py-2 focus:text-sm focus:text-abyss"
      >
        Skip to content
      </a>

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled ? 'glass-strong border-b border-white/10 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.95)]' : 'bg-transparent',
        )}
      >
        <nav className="section-shell flex h-[4.5rem] items-center justify-between gap-4" aria-label="Primary">
          {/* logo */}
          <button onClick={() => go('home')} className="group flex items-center gap-3" aria-label="Go to top">
            <span className="relative grid h-10 w-10 place-items-center">
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-xl border border-cyan-300/45"
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              />
              <motion.span
                aria-hidden
                className="absolute inset-1.5 rounded-lg border border-blue-400/40"
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              />
              <span className="font-display text-sm font-bold tracking-tight text-cyan-200 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]">
                {profile.initials}
              </span>
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="font-display text-sm font-semibold tracking-wide text-ink">Niraj Jadhav</span>
              <span className="font-mono text-[0.6rem] tracking-[0.28em] text-ink-faint uppercase">Data Analyst</span>
            </span>
          </button>

          {/* desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => go(item.id)}
                  aria-current={active === item.id ? 'true' : undefined}
                  className={cn(
                    'relative rounded-full px-3.5 py-2 text-[0.8rem] font-medium transition-colors duration-300',
                    active === item.id ? 'text-ink' : 'text-ink-muted hover:text-ink',
                  )}
                >
                  {active === item.id && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full border border-cyan-300/30 bg-cyan-400/10"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub profile"
              className="hidden h-9 w-9 place-items-center rounded-full border border-white/12 bg-white/5 text-ink-muted transition hover:border-cyan-300/50 hover:text-cyan-200 sm:grid"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
            <a
              href={profile.resume}
              download
              className="hidden items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-400/10 px-4 py-2 text-xs font-medium text-cyan-100 transition hover:bg-cyan-400/20 md:inline-flex"
            >
              <FileDown className="h-3.5 w-3.5" /> Resume
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/5 text-ink lg:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        <motion.div style={{ scaleX: progress }} className="h-px origin-left bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400" />
      </motion.header>

      {/* mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-abyss/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.nav
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="glass-strong absolute inset-x-0 top-0 rounded-b-3xl px-6 pt-24 pb-8"
              aria-label="Mobile"
            >
              <ul className="flex flex-col gap-1">
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * i + 0.1 }}
                  >
                    <button
                      onClick={() => go(item.id)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-base transition',
                        active === item.id ? 'bg-cyan-400/10 text-cyan-100' : 'text-ink-muted hover:bg-white/5 hover:text-ink',
                      )}
                    >
                      {item.label}
                      <span className="font-mono text-[0.65rem] text-ink-faint">{String(i + 1).padStart(2, '0')}</span>
                    </button>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-6 flex gap-3">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/5 py-3 text-sm text-ink"
                >
                  <GithubIcon className="h-4 w-4" /> GitHub
                </a>
                <a
                  href={profile.resume}
                  download
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-400/10 py-3 text-sm text-cyan-100"
                >
                  <FileDown className="h-4 w-4" /> Resume
                </a>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
