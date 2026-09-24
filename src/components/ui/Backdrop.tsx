/**
 * Site-wide ambient background: aurora glows, a masked data grid, film grain
 * and a vignette. Pure CSS so it costs almost nothing on any device.
 */
export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-space">
      {/* Aurora */}
      <div className="absolute -left-[18%] -top-[22%] h-[62vmax] w-[62vmax] rounded-full bg-[radial-gradient(circle,rgba(0,245,212,0.16),transparent_62%)] blur-[60px] animate-aurora" />
      <div
        className="absolute -right-[22%] top-[8%] h-[54vmax] w-[54vmax] rounded-full bg-[radial-gradient(circle,rgba(123,44,191,0.22),transparent_64%)] blur-[70px] animate-aurora"
        style={{ animationDelay: '-6s' }}
      />
      <div
        className="absolute bottom-[-24%] left-[24%] h-[48vmax] w-[48vmax] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.14),transparent_66%)] blur-[70px] animate-aurora"
        style={{ animationDelay: '-11s' }}
      />

      {/* Data grid with a centre-weighted mask */}
      <div className="absolute inset-0 grid-overlay opacity-[0.5] [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_75%)]" />

      {/* Horizon line */}
      <div className="absolute left-0 right-0 top-[62%] h-px bg-gradient-to-r from-transparent via-aqua/25 to-transparent" />

      {/* Film grain + vignette */}
      <div className="absolute inset-0 noise opacity-[0.035] mix-blend-overlay" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(5,8,17,0.85)_100%)]" />
    </div>
  );
}
