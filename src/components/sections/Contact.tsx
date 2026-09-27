import { Suspense, lazy, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Check, CircleAlert } from 'lucide-react';
import { profile } from '../../data/portfolio';
import { SectionHeading } from '../ui/SectionHeading';
import { GlassCard } from '../ui/GlassCard';
import { Reveal } from '../ui/Reveal';
import { MagneticButton } from '../ui/MagneticButton';
import { GithubIcon, LinkedinIcon } from '../ui/BrandIcons';
import { cn } from '../../lib/utils';

const ContactScene = lazy(() => import('../three/ContactScene'));

type Errors = { name?: string; email?: string; message?: string };

const channels = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, icon: Mail },
  { label: 'Phone', value: profile.phone, href: `tel:${profile.phoneHref}`, icon: Phone },
  { label: 'LinkedIn', value: profile.linkedinLabel, href: profile.linkedin, icon: LinkedinIcon },
  { label: 'GitHub', value: 'github.com/jadhavniraj793-hue', href: profile.github, icon: GithubIcon },
  { label: 'Location', value: profile.location, icon: MapPin },
] as const;

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const validate = (): boolean => {
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) next.email = 'Please enter a valid email address.';
    if (form.message.trim().length < 10) next.message = 'A short line about your project helps — 10 characters minimum.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  /**
   * The site is a static build with no backend, so submitting composes a
   * pre-filled email instead of silently dropping the message.
   */
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const subject = encodeURIComponent(`Portfolio enquiry from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n—\n${form.name}\n${form.email}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 6000);
  };

  const field = (name: keyof Errors) =>
    cn(
      'w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-ink placeholder:text-ink-faint transition outline-none',
      errors[name] ? 'border-rose-400/50 focus:border-rose-300' : 'border-white/10 focus:border-cyan-300/60 focus:bg-white/[0.05]',
    );

  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden py-24 sm:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
        <Suspense fallback={null}>
          <ContactScene />
        </Suspense>
      </div>

      <div className="section-shell relative">
        <SectionHeading
          eyebrow="12 — Contact"
          title="Let's Turn Data Into Decisions."
          subtitle="Have a project, opportunity, or analytics problem? Let's connect."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          {/* channels */}
          <div className="space-y-3">
            {channels.map((c, i) => {
              const Icon = c.icon;
              const content = (
                <GlassCard className="flex items-center gap-4 rounded-2xl py-4 transition-colors duration-500 group-hover:border-cyan-300/35">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-cyan-300/25 bg-cyan-400/10 text-cyan-200">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-[0.58rem] tracking-[0.25em] text-ink-faint uppercase">{c.label}</span>
                    <span className="block truncate text-sm text-ink">{c.value}</span>
                  </span>
                </GlassCard>
              );
              return (
                <Reveal key={c.label} delay={i * 0.06}>
                  {'href' in c && c.href ? (
                    <a
                      href={c.href}
                      target={c.href.startsWith('http') ? '_blank' : undefined}
                      rel="noreferrer noopener"
                      className="group block"
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="group">{content}</div>
                  )}
                </Reveal>
              );
            })}
          </div>

          {/* form */}
          <Reveal delay={0.12}>
            <GlassCard strong className="rounded-3xl p-6 sm:p-8">
              <form onSubmit={onSubmit} noValidate className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block font-mono text-[0.6rem] tracking-[0.25em] text-ink-faint uppercase">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className={field('name')}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-[0.7rem] text-rose-300">
                        <CircleAlert className="h-3 w-3" /> {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block font-mono text-[0.6rem] tracking-[0.25em] text-ink-faint uppercase">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@company.com"
                      className={field('email')}
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-[0.7rem] text-rose-300">
                        <CircleAlert className="h-3 w-3" /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="mb-1.5 block font-mono text-[0.6rem] tracking-[0.25em] text-ink-faint uppercase">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about the dataset, the question, or the role…"
                    className={cn(field('message'), 'resize-y')}
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-[0.7rem] text-rose-300">
                      <CircleAlert className="h-3 w-3" /> {errors.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <MagneticButton icon={<Send className="h-4 w-4" />}>
                    <span>Send Message</span>
                  </MagneticButton>
                  {sent && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="inline-flex items-center gap-1.5 text-xs text-emerald-300"
                    >
                      <Check className="h-3.5 w-3.5" /> Your email client should now be open.
                    </motion.span>
                  )}
                </div>

                <p className="pt-1 text-[0.66rem] leading-relaxed text-ink-faint">
                  This portfolio is a static site, so the form opens a pre-filled email to {profile.email} rather than
                  posting to a server.
                </p>
              </form>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
