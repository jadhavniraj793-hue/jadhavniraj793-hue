import { Github, Linkedin, Mail } from 'lucide-react';
import { profile } from '../data/content';

const socials = [
  { icon: Linkedin, href: profile.linkedin, label: 'LinkedIn' },
  { icon: Github, href: profile.github, label: 'GitHub' },
  { icon: Mail, href: `mailto:${profile.email}`, label: 'Email' },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/6 py-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      <div className="section-shell">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="flex items-center gap-3.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 font-display text-sm font-bold text-white shadow-glow-sm">
              {profile.initials}
            </span>
            <div>
              <p className="font-display text-[15px] font-semibold text-white">{profile.fullName}</p>
              <p className="text-xs font-medium text-slate-500">{profile.role}</p>
            </div>
          </div>

          <p className="font-display text-sm italic text-slate-500">“{profile.headline}”</p>

          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.label === 'Email' ? undefined : '_blank'}
                rel={s.label === 'Email' ? undefined : 'noreferrer'}
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/40 hover:text-white hover:shadow-glow-sm"
              >
                <s.icon size={17} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-7 text-[12.5px] text-slate-600 sm:flex-row">
          <p>© 2026 Niraj Laxman Jadhav. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with
            <span className="font-medium text-slate-400">React</span>·
            <span className="font-medium text-slate-400">Three.js</span>·
            <span className="font-medium text-slate-400">Tailwind CSS</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
