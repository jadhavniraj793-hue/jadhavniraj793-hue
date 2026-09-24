import { AnimatePresence, motion } from 'framer-motion';
import { BadgeCheck, Calendar, ChevronLeft, ChevronRight, Hash, Maximize2, Award } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { certificates, profile, type Certificate } from '../data/content';
import { useHasHover, useReducedMotion } from '../hooks/useMediaQuery';
import { Modal } from './ui/Modal';
import { SectionHeading } from './ui/SectionHeading';

/* ------------------------- styled certificate sheet ------------------------- */

/**
 * Elegant stylised representation of a certificate. When a scanned image is
 * placed in `public/certificates/<id>.<ext>` and referenced in the data file,
 * the real document is displayed instead — nothing here invents issuer details.
 */
export function CertificateSheet({ cert, large = false }: { cert: Certificate; large?: boolean }) {
  const monogram = (cert.issuer ?? cert.title)
    .split(/[\s—-]+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(160deg,#0c1226,#070b16_55%,#0a1020)] p-6 sm:p-8">
      {/* guilloche-style corner ornaments */}
      <div className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full border border-violet-400/12" />
      <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full border border-violet-400/10" />
      <div className="pointer-events-none absolute -bottom-20 -right-16 h-52 w-52 rounded-full border border-cyan-300/10" />
      <div className="pointer-events-none absolute -bottom-14 -right-10 h-36 w-36 rounded-full border border-cyan-300/8" />
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl font-display text-sm font-bold"
            style={{ background: `${cert.accent}1a`, color: cert.accent, border: `1px solid ${cert.accent}44` }}
          >
            {monogram}
          </span>
          <div>
            {cert.issuer && <p className="text-sm font-semibold text-slate-200">{cert.issuer}</p>}
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">{cert.kind}</p>
          </div>
        </div>
        <Award size={20} style={{ color: cert.accent }} className="opacity-70" />
      </div>

      <div className="relative mt-8 text-center sm:mt-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-slate-500">Certificate</p>
        <h4
          className={`mx-auto mt-3 max-w-xl font-display font-semibold leading-snug text-white ${
            large ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'
          }`}
        >
          {cert.title}
        </h4>
        <p className="mt-4 text-[11px] uppercase tracking-[0.28em] text-slate-500">
          Presented to <span className="font-semibold text-slate-300">{profile.fullName}</span>
        </p>
      </div>

      <div className="relative mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-slate-400">
        {cert.date && (
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={13} style={{ color: cert.accent }} />
            {cert.date}
          </span>
        )}
        {cert.certId && (
          <span className="inline-flex items-center gap-1.5 font-mono">
            <Hash size={13} style={{ color: cert.accent }} />
            {cert.certId}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <BadgeCheck size={13} style={{ color: cert.accent }} />
          Achievement credential
        </span>
      </div>

      {/* seal */}
      <div className="pointer-events-none absolute bottom-5 right-6 hidden sm:block">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 text-center font-display text-[9px] font-bold uppercase tracking-widest"
          style={{ borderColor: `${cert.accent}55`, color: `${cert.accent}cc`, boxShadow: `0 0 26px ${cert.accent}22` }}
        >
          <span>
            Certified
            <br />★
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ modal content ------------------------------- */

function CertificateModalBody({
  cert,
  onZoom,
  zoomed,
}: {
  cert: Certificate;
  onZoom: () => void;
  zoomed: boolean;
}) {
  return (
    <div className="p-6 sm:p-8">
      {cert.image ? (
        <img
          src={cert.image}
          alt={`${cert.title} certificate`}
          className="max-h-[52vh] w-full rounded-xl border border-white/10 object-contain"
        />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={zoomed ? 'zoom' : 'normal'}
            initial={{ scale: zoomed ? 0.86 : 1, opacity: zoomed ? 0.4 : 1 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: zoomed ? 1 : 1.06, opacity: 0.4 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          >
            <CertificateSheet cert={cert} large={zoomed} />
          </motion.div>
        </AnimatePresence>
      )}

      {cert.skills && cert.skills.length > 0 && (
        <div className="mt-6">
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Skills & topics covered
          </p>
          <div className="flex flex-wrap gap-1.5">
            {cert.skills.map((s) => (
              <span key={s} className="chip text-[11px] text-slate-300">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {!cert.image && (
        <p className="mt-5 text-center text-[11px] italic text-slate-600">
          Styled digital representation — the original certificate document is available on request.
        </p>
      )}

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button onClick={onZoom} className="btn-primary !px-6 !py-3 text-[13px]">
          <Maximize2 size={15} />
          View Certificate
        </button>
      </div>
    </div>
  );
}

/* ------------------------------- 3D carousel -------------------------------- */

const CARD_W = 280;
const CARD_H = 350;

function VaultCarousel({ onOpen }: { onOpen: (c: Certificate) => void }) {
  const n = certificates.length;
  const step = 360 / n;
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const target = useRef(0);
  const current = useRef(0);
  const [index, setIndex] = useState(0);
  const paused = useRef(false);
  const dragging = useRef(false);
  const moved = useRef(0);
  const startX = useRef(0);
  const startTarget = useRef(0);
  const radiusRef = useRef(430);
  const reduced = useReducedMotion();
  const hasHover = useHasHover();

  const [radius, setRadius] = useState(430);

  useEffect(() => {
    const measure = () => {
      const w = containerRef.current?.clientWidth ?? 900;
      const r = Math.max(300, Math.min(520, (CARD_W / 2) / Math.tan(Math.PI / n) + w * 0.16));
      radiusRef.current = r;
      setRadius(r);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [n]);

  // auto rotation
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      if (!paused.current && !dragging.current) target.current -= step;
    }, 3600);
    return () => clearInterval(id);
  }, [step, reduced]);

  // render loop
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      current.current += (target.current - current.current) * 0.065;
      const rot = current.current;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const a = rot + i * step;
        const rad = (a * Math.PI) / 180;
        const facing = Math.cos(rad);
        el.style.transform = `translate(-50%, -50%) rotateY(${a}deg) translateZ(${radiusRef.current}px) rotateY(${-a}deg)`;
        el.style.zIndex = String(Math.round(100 + facing * 100));
        el.style.opacity = String(0.42 + 0.58 * Math.max(0.15, (facing + 1) / 2));
        el.style.filter = `brightness(${0.62 + 0.38 * Math.max(0.25, (facing + 1) / 2)})`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [step]);

  // sync visible index for the counter
  useEffect(() => {
    const id = setInterval(() => {
      const front = ((Math.round(-current.current / step) % n) + n) % n;
      setIndex(front);
    }, 300);
    return () => clearInterval(id);
  }, [step, n]);

  const go = useCallback((dir: 1 | -1) => {
    target.current -= dir * step;
  }, [step]);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    moved.current = 0;
    startX.current = e.clientX;
    startTarget.current = target.current;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - startX.current;
    moved.current = Math.max(moved.current, Math.abs(dx));
    target.current = startTarget.current - dx * 0.28;
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="relative mx-auto h-[400px] w-full max-w-5xl cursor-grab select-none [perspective:1500px] active:cursor-grabbing sm:h-[430px]"
        onPointerEnter={() => hasHover && (paused.current = true)}
        onPointerLeave={() => {
          paused.current = false;
          dragging.current = false;
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* floor glow */}
        <div className="pointer-events-none absolute inset-x-16 bottom-2 h-24 rounded-full bg-violet-600/18 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-32 bottom-6 h-14 rounded-full bg-cyan-400/14 blur-2xl" />

        {/* center medallion */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2">
          <div className="glass flex h-32 w-32 flex-col items-center justify-center rounded-full shadow-glow sm:h-36 sm:w-36">
            <Award size={26} className="text-violet-300" />
            <span className="mt-1.5 font-display text-2xl font-bold text-white">
              {String(n).padStart(2, '0')}
            </span>
            <span className="text-[8.5px] font-medium uppercase tracking-[0.22em] text-slate-500">Credentials</span>
          </div>
          <div className="absolute inset-0 -z-10 animate-pulse-ring rounded-full border border-violet-400/40" />
        </div>

        {certificates.map((cert, i) => (
          <div
            key={cert.id}
            ref={(el) => (cardRefs.current[i] = el)}
            className="absolute left-1/2 top-1/2"
            style={{ width: 'min(280px, 74vw)' }}
            onClick={() => {
              if (moved.current < 8) onOpen(cert);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onOpen(cert)}
            aria-label={`Open ${cert.title}`}
          >
            <div
              className="glass group relative flex cursor-pointer flex-col rounded-3xl p-5 shadow-card transition-all duration-300 hover:border-violet-400/35 hover:shadow-glow"
              style={{ height: CARD_H }}
            >
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-25 blur-2xl transition-opacity group-hover:opacity-60"
                style={{ background: cert.accent }}
              />
              <div className="flex items-center justify-between">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-2xl font-display text-[13px] font-bold"
                  style={{
                    background: `${cert.accent}17`,
                    color: cert.accent,
                    border: `1px solid ${cert.accent}40`,
                  }}
                >
                  {(cert.issuer ?? cert.title)
                    .split(/[\s—-]+/)
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join('')
                    .toUpperCase()}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  {cert.kind}
                </span>
              </div>

              <h3 className="relative mt-5 line-clamp-3 font-display text-[17px] font-semibold leading-snug text-white">
                {cert.title}
              </h3>
              {cert.issuer && <p className="relative mt-2 text-[13px] font-medium text-slate-400">{cert.issuer}</p>}

              <div className="relative mt-auto space-y-1.5 text-[11.5px] text-slate-500">
                {cert.date && (
                  <p className="flex items-center gap-1.5">
                    <Calendar size={12} style={{ color: cert.accent }} />
                    {cert.date}
                  </p>
                )}
                {cert.certId && (
                  <p className="flex items-center gap-1.5 font-mono text-[10.5px]">
                    <Hash size={12} style={{ color: cert.accent }} />
                    {cert.certId}
                  </p>
                )}
                <p className="flex items-center gap-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Maximize2 size={11} /> Click to view
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* controls */}
      <div className="mt-8 flex items-center justify-center gap-5">
        <button
          onClick={() => go(-1)}
          aria-label="Previous certificate"
          className="rounded-full border border-white/12 bg-white/[0.04] p-3 text-slate-300 transition-all hover:border-violet-400/40 hover:text-white hover:shadow-glow-sm"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center gap-2 font-mono text-xs text-slate-500">
          <span className="text-sm font-semibold text-white">{String(index + 1).padStart(2, '0')}</span>
          <span className="text-slate-600">/ {String(n).padStart(2, '0')}</span>
        </div>
        <button
          onClick={() => go(1)}
          aria-label="Next certificate"
          className="rounded-full border border-white/12 bg-white/[0.04] p-3 text-slate-300 transition-all hover:border-violet-400/40 hover:text-white hover:shadow-glow-sm"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* fixed-size spacer keeps layout stable with absolutely-positioned cards */}
      <div className="sr-only" aria-hidden style={{ width: radius }} />
    </div>
  );
}

/* --------------------------------- section ---------------------------------- */

export function Certifications() {
  const [active, setActive] = useState<Certificate | null>(null);
  const [zoomed, setZoomed] = useState(false);

  const open = (c: Certificate) => {
    setActive(c);
    setZoomed(false);
  };
  const close = () => {
    setActive(null);
    setZoomed(false);
  };

  const zoom = () => {
    if (!active) return;
    if (active.image) {
      window.open(active.image, '_blank');
    } else {
      setZoomed((v) => !v);
    }
  };

  return (
    <section id="certifications" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-400/35 to-transparent" />
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full bg-violet-600/10 blur-[150px]" />

      <div className="section-shell">
        <SectionHeading
          eyebrow="Certification Vault"
          title={
            <>
              The <span className="text-gradient">Credential</span> Gallery
            </>
          }
          description="A rotating vault of verified certifications, job simulations and learning programs — click any certificate to inspect it up close."
        />

        <VaultCarousel onOpen={open} />
      </div>

      {/* main certificate modal */}
      <Modal open={!!active && !zoomed} onClose={close} maxWidth="max-w-2xl" label={active?.title}>
        {active && <CertificateModalBody cert={active} onZoom={zoom} zoomed={zoomed} />}
      </Modal>

      {/* fullscreen zoom layer */}
      <AnimatePresence>
        {active && zoomed && (
          <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 sm:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setZoomed(false)}
              className="absolute inset-0 bg-void/90 backdrop-blur-lg"
            />
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 60 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.82, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 210, damping: 24 }}
              className="relative z-10 w-full max-w-4xl"
            >
              <div className="max-h-[86vh] overflow-y-auto rounded-3xl border border-white/12 bg-abyss/95 p-5 shadow-glow sm:p-8">
                <CertificateSheet cert={active} large />
                {active.skills && (
                  <div className="mt-6 flex flex-wrap justify-center gap-1.5">
                    {active.skills.map((s) => (
                      <span key={s} className="chip text-[11px] text-slate-300">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-7 flex justify-center gap-3">
                  <button onClick={() => setZoomed(false)} className="btn-ghost !px-6 !py-3 text-[13px]">
                    Back
                  </button>
                  <button onClick={close} className="btn-primary !px-6 !py-3 text-[13px]">
                    Close
                  </button>
                </div>
              </div>
              <button
                onClick={() => setZoomed(false)}
                aria-label="Close zoomed view"
                className="absolute -top-3 right-0 rounded-full border border-white/15 bg-void/80 px-3 py-1.5 text-[11px] font-semibold text-slate-300 backdrop-blur hover:text-white sm:right-2"
              >
                ESC to shrink
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
