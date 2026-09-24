'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Clock,
  Copy,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { profile, sectionMeta } from '@/lib/data';
import { useMounted } from '@/lib/hooks';
import { NeonButton } from '../ui/NeonButton';
import { Reveal } from '../ui/Reveal';
import { SectionShell } from '../ui/SectionShell';
import { TiltCard } from '../ui/TiltCard';

/* ------------------------------------------------------------------ *
 * Live Mumbai clock — a small "data feed" detail that rewards attention
 * ------------------------------------------------------------------ */
function MumbaiClock() {
  const mounted = useMounted();
  const [time, setTime] = useState('--:--:--');

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(new Date());

    setTime(format());
    const id = setInterval(() => setTime(format()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ash">
      <Clock className="h-3.5 w-3.5 text-aqua/80" strokeWidth={1.9} />
      <span>IST</span>
      <span className="text-aqua tabular-nums" suppressHydrationWarning>
        {mounted ? time : '--:--:--'}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Copy-to-clipboard contact row
 * ------------------------------------------------------------------ */
function ContactRow({
  icon: Icon,
  label,
  value,
  href,
  copyable,
  accent = 'cyan',
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
  copyable?: boolean;
  accent?: 'cyan' | 'violet';
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — the value is visible and selectable anyway */
    }
  }

  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.02] p-3.5 transition-colors duration-300 hover:border-aqua/30 hover:bg-white/[0.04]">
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${
          accent === 'cyan'
            ? 'border-aqua/25 bg-aqua/10 text-aqua'
            : 'border-violet-glow/25 bg-violet-core/15 text-violet-glow'
        }`}
      >
        <Icon className="h-4 w-4" strokeWidth={1.9} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash-dim">{label}</p>
        {href ? (
          <a
            href={href}
            {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
            className="block truncate text-sm text-mist transition-colors hover:text-aqua"
          >
            {value}
          </a>
        ) : (
          <p className="truncate text-sm text-mist">{value}</p>
        )}
      </div>

      {copyable && (
        <button
          onClick={copy}
          aria-label={`Copy ${label}`}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 text-ash transition-colors hover:border-aqua/40 hover:text-aqua"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-aqua" strokeWidth={2.2} />
          ) : (
            <Copy className="h-3.5 w-3.5" strokeWidth={1.9} />
          )}
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Glassmorphism message form (no backend — hands off to the mail client)
 * ------------------------------------------------------------------ */
type Status = 'idle' | 'sent';

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>('idle');

  function validate() {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      next.email = 'Please enter a valid email address.';
    if (form.message.trim().length < 10) next.message = 'Tell me a little more (10+ characters).';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    const subject = encodeURIComponent(`Portfolio enquiry — ${form.name.trim()}`);
    const body = encodeURIComponent(
      `Hi Niraj,\n\n${form.message.trim()}\n\n—\n${form.name.trim()}\n${form.email.trim()}`
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setStatus('sent');
  }

  const field =
    'w-full rounded-2xl border bg-space/40 px-4 py-3 text-sm text-mist placeholder:text-ash-dim outline-none transition-colors duration-300 focus:border-aqua/60 focus:bg-space/60';

  if (status === 'sent') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-3xl glass p-8 text-center"
      >
        <span className="relative grid h-16 w-16 place-items-center rounded-2xl border border-aqua/30 bg-aqua/10 text-aqua">
          <Check className="h-7 w-7" strokeWidth={2.2} />
          <span className="absolute inset-0 rounded-2xl border border-aqua/40 animate-ping" />
        </span>
        <h3 className="mt-5 font-display text-xl font-semibold text-mist">
          Message ready to send
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-ash">
          Your mail client should now be open with the message pre-filled. If nothing happened, use
          one of the direct buttons.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <NeonButton
            as="a"
            href={`mailto:${profile.email}`}
            variant="primary"
            icon={<Mail className="h-4 w-4" strokeWidth={2} />}
          >
            Email {profile.shortName.split(' ')[0]}
          </NeonButton>
          <NeonButton variant="glass" onClick={() => setStatus('idle')}>
            Write another
          </NeonButton>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-3xl glass p-6 sm:p-7" noValidate>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-mist">Send a message</h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-aqua/80">
          secure · direct
        </span>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.18em] text-ash">
            Your name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="Ada Lovelace"
            aria-invalid={Boolean(errors.name)}
            className={`${field} ${errors.name ? 'border-rose-400/60' : 'border-white/10'}`}
          />
          {errors.name && <p className="mt-1.5 text-[11px] text-rose-300/90">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.18em] text-ash">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="you@company.com"
            aria-invalid={Boolean(errors.email)}
            className={`${field} ${errors.email ? 'border-rose-400/60' : 'border-white/10'}`}
          />
          {errors.email && <p className="mt-1.5 text-[11px] text-rose-300/90">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="message" className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.18em] text-ash">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={form.message}
            onChange={(event) => setForm({ ...form, message: event.target.value })}
            placeholder="Tell me about the data problem you'd like solved…"
            aria-invalid={Boolean(errors.message)}
            className={`${field} resize-none ${errors.message ? 'border-rose-400/60' : 'border-white/10'}`}
          />
          {errors.message && (
            <p className="mt-1.5 text-[11px] text-rose-300/90">{errors.message}</p>
          )}
        </div>
      </div>

      <NeonButton
        type="submit"
        size="lg"
        className="mt-6 w-full"
        icon={<Send className="h-4 w-4" strokeWidth={2} />}
        iconRight={<ArrowRight className="h-4 w-4" strokeWidth={2} />}
      >
        Send message
      </NeonButton>

      <p className="mt-3 text-center font-mono text-[10px] leading-relaxed text-ash-dim">
        Opens your email client with the message pre-filled — no data leaves your device.
      </p>
    </form>
  );
}

export function Contact() {
  const meta = sectionMeta.contact;
  const firstName = profile.shortName.split(' ')[0];

  return (
    <SectionShell
      id="contact"
      index={meta.index}
      label={meta.label}
      title={meta.title}
      kicker={meta.kicker}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-8">
        {/* ---------- Direct channels ---------- */}
        <div className="flex flex-col gap-5">
          <Reveal>
            <TiltCard intensity={6} className="p-6 sm:p-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-aqua/25 bg-aqua/10 px-3 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-aqua animate-blip" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-aqua" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-aqua">
                  {profile.availability}
                </span>
              </div>

              <h3 className="mt-5 font-display text-xl font-semibold leading-snug text-mist sm:text-2xl">
                Have data that needs a story?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ash">
                Whether it&apos;s a messy spreadsheet, a growing SQL warehouse or a dashboard nobody
                reads — I&apos;ll help you turn it into decisions. Fastest reply on email or
                WhatsApp.
              </p>

              <div className="mt-6 space-y-3">
                <ContactRow
                  icon={MapPin}
                  label="Location"
                  value={profile.location}
                  accent="cyan"
                />
                <ContactRow
                  icon={Phone}
                  label="Phone"
                  value={profile.phone}
                  href={`tel:${profile.phoneHref}`}
                  copyable
                  accent="cyan"
                />
                <ContactRow
                  icon={Mail}
                  label="Email"
                  value={profile.email}
                  href={`mailto:${profile.email}`}
                  copyable
                  accent="violet"
                />
                <ContactRow
                  icon={Linkedin}
                  label="LinkedIn"
                  value="/in/niraj-jadhav-b31"
                  href={profile.linkedin}
                  accent="violet"
                />
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-5">
                <MumbaiClock />
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ash-dim">
                  <Sparkles className="h-3 w-3 text-aqua/70" strokeWidth={2} />
                  replies within 24h
                </span>
              </div>
            </TiltCard>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid gap-3 sm:grid-cols-3">
              <NeonButton
                as="a"
                href={`mailto:${profile.email}`}
                variant="primary"
                className="w-full"
                icon={<Mail className="h-4 w-4" strokeWidth={2} />}
              >
                Email
              </NeonButton>
              <NeonButton
                as="a"
                href={profile.whatsappHref}
                target="_blank"
                rel="noreferrer noopener"
                variant="glass"
                className="w-full"
                icon={<MessageCircle className="h-4 w-4" strokeWidth={2} />}
              >
                WhatsApp
              </NeonButton>
              <NeonButton
                as="a"
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                variant="glass"
                className="w-full"
                icon={<Linkedin className="h-4 w-4" strokeWidth={2} />}
              >
                LinkedIn
              </NeonButton>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash-dim">
                quick link
              </span>
              <a
                href={profile.whatsappHref}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 text-sm text-mist transition-colors hover:text-aqua"
              >
                Chat on WhatsApp
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
              </a>
              <span className="text-ash-dim">·</span>
              <span className="text-sm text-ash">Ask me about {firstName}&apos;s dashboards</span>
            </div>
          </Reveal>
        </div>

        {/* ---------- Form ---------- */}
        <Reveal delay={0.08}>
          <ContactForm />
        </Reveal>
      </div>
    </SectionShell>
  );
}
