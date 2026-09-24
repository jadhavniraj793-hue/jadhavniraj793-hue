'use client';

import { motion } from 'framer-motion';
import { ArrowUp, Heart, Linkedin, Mail, MessageCircle, Phone } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { navLinks, profile } from '@/lib/data';
import { smoothScrollTo, useDeviceTier, useInViewport, useMounted } from '@/lib/hooks';

const FooterScene = dynamic(() => import('../three/FooterScene').then((mod) => mod.FooterScene), {
  ssr: false,
  loading: () => null,
});

const SOCIALS = [
  { href: profile.linkedin, label: 'LinkedIn', Icon: Linkedin, external: true },
  { href: `mailto:${profile.email}`, label: 'Email', Icon: Mail, external: false },
  { href: profile.whatsappHref, label: 'WhatsApp', Icon: MessageCircle, external: true },
  { href: `tel:${profile.phoneHref}`, label: 'Phone', Icon: Phone, external: false },
];

export function Footer() {
  const wrap = useRef<HTMLElement>(null);
  const tier = useDeviceTier();
  const mounted = useMounted();
  const inView = useInViewport(wrap, { rootMargin: '120px' });
  const show3D = tier === 'high' || tier === 'medium';

  return (
    <footer ref={wrap} className="relative mt-10 overflow-hidden border-t border-white/8">
      {/* ---------- 3D particle floor ---------- */}
      <div className="absolute inset-0 opacity-90" aria-hidden>
        {show3D ? (
          <FooterScene quality={tier === 'high' ? 'high' : 'medium'} active={inView} />
        ) : (
          <div className="absolute inset-0">
            {Array.from({ length: 34 }).map((_, i) => (
              <span
                key={i}
                className="absolute h-1 w-1 rounded-full bg-aqua/50 animate-twinkle"
                style={{
                  left: `${(i * 37) % 100}%`,
                  top: `${(i * 53) % 100}%`,
                  animationDelay: `${(i % 9) * 0.4}s`,
                }}
              />
            ))}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-space via-space/70 to-space" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-10 pt-16 sm:px-8 sm:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr]">
          {/* ---------- Brand ---------- */}
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl border border-aqua/30 bg-gradient-to-br from-aqua/20 to-violet-core/25">
                <span className="font-display text-base font-bold text-aqua">
                  {profile.initials}
                </span>
              </span>
              <div>
                <p className="font-display text-base font-semibold text-mist">{profile.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ash">
                  {profile.title}
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ash">{profile.tagline}</p>

            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map(({ href, label, Icon, external }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-ash transition-all duration-300 hover:-translate-y-0.5 hover:border-aqua/50 hover:text-aqua hover:shadow-[0_0_26px_-8px_rgba(0,245,212,0.7)]"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.9} />
                </a>
              ))}
            </div>
          </div>

          {/* ---------- Navigate ---------- */}
          <nav aria-label="Footer">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-aqua/80">
              navigate
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-1">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => smoothScrollTo(`#${link.id}`, -76)}
                    className="text-sm text-ash transition-colors duration-300 hover:text-aqua"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* ---------- Contact ---------- */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-aqua/80">
              get in touch
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="break-all text-ash transition-colors hover:text-aqua"
                >
                  {profile.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${profile.phoneHref}`}
                  className="text-ash transition-colors hover:text-aqua"
                >
                  {profile.phone}
                </a>
              </li>
              <li className="text-ash">{profile.location}</li>
              <li>
                <a
                  href={profile.resumePath}
                  download="Niraj-Jadhav-Resume.pdf"
                  className="inline-flex items-center gap-2 text-aqua transition-opacity hover:opacity-80"
                >
                  Download Résumé
                </a>
              </li>
            </ul>

            <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.02] p-3.5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash-dim">
                system status
              </p>
              <p className="mt-1.5 flex items-center gap-2 text-[12px] text-mist/90">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-aqua animate-blip" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-aqua" />
                </span>
                Available for new analytics work
              </p>
            </div>
          </div>
        </div>

        {/* ---------- Baseline ---------- */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] text-ash-dim">
            © {mounted ? new Date().getFullYear() : 2025} {profile.name}. Built with{' '}
            <Heart className="inline h-3 w-3 text-aqua" strokeWidth={2.2} /> for data.
          </p>

          <p className="font-mono text-[11px] text-ash-dim">
            Next.js 15 · React Three Fiber · Framer Motion · Tailwind v4
          </p>

          <motion.button
            whileHover={{ y: -2 }}
            onClick={() => smoothScrollTo('#home', 0)}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ash transition-colors hover:border-aqua/40 hover:text-aqua"
          >
            <ArrowUp className="h-3.5 w-3.5" strokeWidth={2} />
            back to top
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
