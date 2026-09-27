import { Mail, ArrowUp } from 'lucide-react';
import { profile } from '../../data/portfolio';
import { GithubIcon, LinkedinIcon } from '../ui/BrandIcons';

const links = [
  { label: 'GitHub', href: profile.github, icon: GithubIcon },
  { label: 'LinkedIn', href: profile.linkedin, icon: LinkedinIcon },
  { label: 'Email', href: `mailto:${profile.email}`, icon: Mail },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/8 py-12">
      <div className="section-shell">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-lg font-bold tracking-tight text-ink">{profile.fullName}</p>
            <p className="mt-1 font-mono text-[0.62rem] tracking-[0.3em] text-cyan-200/80 uppercase">{profile.role}</p>
            <p className="mt-3 text-sm text-ink-muted">“{profile.tagline}”</p>
          </div>

          <div className="flex items-center gap-2">
            {links.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer noopener"
                className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-ink-muted transition hover:border-cyan-300/45 hover:text-cyan-100"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </a>
            ))}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-ink-muted transition hover:border-cyan-300/45 hover:text-cyan-100"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="hairline my-8" />

        <div className="flex flex-col items-start justify-between gap-2 text-[0.7rem] text-ink-faint sm:flex-row sm:items-center">
          <p>© 2026 Niraj Laxman Jadhav. All rights reserved.</p>
          <p className="font-mono">Built with React · TypeScript · Three.js · Recharts</p>
        </div>
      </div>
    </footer>
  );
}
