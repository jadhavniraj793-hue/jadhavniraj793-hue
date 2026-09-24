import { motion } from 'framer-motion';
import { Check, Copy, Github, Linkedin, Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import { profile } from '../data/content';
import { useHasHover } from '../hooks/useMediaQuery';
import { NetworkCanvas } from './NetworkCanvas';
import { SectionHeading } from './ui/SectionHeading';
import { TiltCard } from './ui/TiltCard';

function EmailCard() {
  const [copied, setCopied] = useState(false);
  const canHover = useHasHover();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — mailto link still works */
    }
  };

  return (
    <TiltCard intensity={8} className="rounded-3xl">
      <div className="glass group relative flex h-full flex-col items-center overflow-hidden rounded-3xl p-8 text-center transition-all duration-500 hover:border-cyan-300/30 hover:shadow-glow-cyan">
        <div className="pointer-events-none absolute -top-12 h-32 w-32 rounded-full bg-cyan-400/15 blur-3xl" />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-400/10 text-cyan-300 transition-transform duration-500 group-hover:scale-110">
          <Mail size={22} />
        </span>
        <h3 className="relative mt-5 font-display text-lg font-semibold text-white">Email</h3>
        <a
          href={`mailto:${profile.email}`}
          className="relative mt-1.5 break-all text-[13px] text-slate-400 transition-colors hover:text-cyan-300"
        >
          {profile.email}
        </a>
        {canHover && (
          <button
            onClick={copy}
            className="relative mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-semibold text-slate-400 transition-all hover:border-cyan-300/40 hover:text-cyan-200"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy address'}
          </button>
        )}
      </div>
    </TiltCard>
  );
}

export function Contact() {
  const cards = [
    {
      key: 'linkedin',
      icon: Linkedin,
      title: 'LinkedIn',
      value: 'Connect with me professionally',
      href: profile.linkedin,
      accent: '#60a5fa',
      external: true,
    },
    {
      key: 'phone',
      icon: Phone,
      title: 'Phone',
      value: profile.phoneDisplay,
      href: profile.phoneHref,
      accent: '#a78bfa',
      external: false,
    },
    {
      key: 'github',
      icon: Github,
      title: 'GitHub',
      value: 'Explore my code & projects',
      href: profile.github,
      accent: '#e2e8f0',
      external: true,
    },
  ];

  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden py-24 sm:py-32">
      {/* floating connection-node network */}
      <NetworkCanvas className="pointer-events-none absolute inset-0 h-full w-full opacity-55 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black,transparent)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[380px] w-[560px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[150px]" />

      <div className="section-shell relative">
        <SectionHeading
          eyebrow="Get In Touch"
          title={
            <>
              Let&apos;s <span className="text-gradient">Connect</span>
            </>
          }
          description="Interested in working together or discussing data analytics? Let's connect."
        />

        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-70px' }}
            transition={{ duration: 0.65 }}
          >
            <EmailCard />
          </motion.div>

          {cards.map((c, i) => (
            <motion.div
              key={c.key}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-70px' }}
              transition={{ duration: 0.65, delay: 0.1 + i * 0.1 }}
            >
              <TiltCard intensity={8} className="rounded-3xl">
                <a
                  href={c.href}
                  target={c.external ? '_blank' : undefined}
                  rel={c.external ? 'noreferrer' : undefined}
                  className="glass group relative flex h-full flex-col items-center overflow-hidden rounded-3xl p-8 text-center transition-all duration-500 hover:border-white/25 hover:shadow-glow"
                >
                  <div className="pointer-events-none absolute -top-12 h-32 w-32 rounded-full opacity-15 blur-3xl transition-opacity duration-500 group-hover:opacity-40" style={{ background: c.accent }} />
                  <span
                    className="relative flex h-14 w-14 items-center justify-center rounded-2xl border transition-transform duration-500 group-hover:scale-110"
                    style={{ borderColor: `${c.accent}44`, background: `${c.accent}12`, color: c.accent }}
                  >
                    <c.icon size={22} />
                  </span>
                  <h3 className="relative mt-5 font-display text-lg font-semibold text-white">{c.title}</h3>
                  <p className="relative mt-1.5 text-[13px] text-slate-400">{c.value}</p>
                  <span className="relative mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 transition-colors duration-300 group-hover:text-cyan-300">
                    Open →
                  </span>
                </a>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.9 }}
          className="mx-auto mt-14 max-w-xl text-center font-display text-lg italic text-slate-400"
        >
          “{profile.headline}”
        </motion.p>
      </div>
    </section>
  );
}
