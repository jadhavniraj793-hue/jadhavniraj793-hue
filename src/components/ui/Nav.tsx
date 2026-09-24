'use client';

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Download, Mail, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { navLinks, profile } from '@/lib/data';
import { smoothScrollTo, useActiveSection } from '@/lib/hooks';
import { NeonButton } from './NeonButton';

const IDS = navLinks.map((link) => link.id);

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const active = useActiveSection(IDS);

  useMotionValueEvent(scrollY, 'change', (value) => {
    setScrolled(value > 40);
  });

  // Lock background scroll while the mobile drawer is open.
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function go(id: string) {
    setOpen(false);
    // Let the drawer close before the scroll animation starts.
    requestAnimationFrame(() => smoothScrollTo(`#${id}`, -76));
  }

  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-aqua focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-space"
      >
        Skip to content
      </a>

      <header className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4">
        <nav
          className={`mx-auto flex w-[min(100%_-_1.5rem,1240px)] items-center justify-between rounded-2xl px-3 py-2.5 transition-all duration-500 sm:px-4 ${
            scrolled ? 'glass shadow-[0_20px_60px_-40px_rgba(0,0,0,1)]' : 'border border-transparent'
          }`}
          aria-label="Primary"
        >
          {/* Brand */}
          <button
            onClick={() => go('home')}
            className="group flex items-center gap-2.5 rounded-xl px-1 py-1 text-left"
          >
            <span className="relative grid h-9 w-9 place-items-center rounded-xl border border-aqua/35 bg-gradient-to-br from-aqua/20 to-violet-core/25">
              <span className="font-display text-sm font-bold text-aqua">{profile.initials}</span>
              <span className="absolute inset-0 rounded-xl opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100 bg-aqua/30" />
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block font-display text-[13px] font-semibold tracking-tight text-mist">
                {profile.shortName}
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-ash">
                Data Analyst
              </span>
            </span>
          </button>

          {/* Desktop links */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id}>
                  <button
                    onClick={() => go(link.id)}
                    className={`relative rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors duration-300 ${
                      isActive ? 'text-aqua' : 'text-ash hover:text-mist'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full border border-aqua/30 bg-aqua/10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <NeonButton
              as="a"
              href={profile.resumePath}
              download
              variant="glass"
              size="sm"
              className="hidden sm:inline-flex"
              icon={<Download className="h-3.5 w-3.5" strokeWidth={2} />}
            >
              Resume
            </NeonButton>
            <NeonButton
              as="a"
              href="#contact"
              onClick={(event) => {
                event.preventDefault();
                go('contact');
              }}
              variant="primary"
              size="sm"
              className="hidden sm:inline-flex"
              icon={<Mail className="h-3.5 w-3.5" strokeWidth={2} />}
            >
              Get in Touch
            </NeonButton>

            <button
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-mist transition-colors hover:border-aqua/40 hover:text-aqua lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-space/85 backdrop-blur-xl" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ y: -24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-3 top-[76px] rounded-3xl glass p-5"
              data-lenis-prevent
            >
              <ul className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.045 }}
                  >
                    <button
                      onClick={() => go(link.id)}
                      className={`flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left text-base transition-colors ${
                        active === link.id
                          ? 'bg-aqua/10 text-aqua'
                          : 'text-mist hover:bg-white/5'
                      }`}
                    >
                      <span className="font-display font-medium">{link.label}</span>
                      <span className="font-mono text-[10px] text-ash">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/8 pt-4">
                <NeonButton as="a" href={profile.resumePath} download variant="glass" size="md" icon={<Download className="h-4 w-4" />}>
                  Resume
                </NeonButton>
                <NeonButton
                  as="a"
                  href="#contact"
                  onClick={(event) => {
                    event.preventDefault();
                    go('contact');
                  }}
                  variant="primary"
                  size="md"
                  icon={<Mail className="h-4 w-4" />}
                >
                  Contact
                </NeonButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
