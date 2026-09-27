import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, CircleAlert, ArrowUpRight, Boxes, Users, CloudOff } from 'lucide-react';
import { profile } from '../../data/portfolio';
import { useGitHub } from '../../hooks/useGitHub';
import { SectionHeading } from '../ui/SectionHeading';
import { GlassCard } from '../ui/GlassCard';
import { Reveal } from '../ui/Reveal';
import { TiltCard } from '../ui/TiltCard';
import { MagneticButton } from '../ui/MagneticButton';
import { GithubIcon } from '../ui/BrandIcons';
import { cn } from '../../lib/utils';

const WEEKS = 26;

/** Heatmap built strictly from real repository update timestamps. */
function ActivityGrid({ dates }: { dates: string[] }) {
  const cells = useMemo(() => {
    const now = new Date();
    const buckets = new Array(WEEKS * 7).fill(0);
    dates.forEach((iso) => {
      const d = new Date(iso);
      const days = Math.floor((now.getTime() - d.getTime()) / 86_400_000);
      if (days >= 0 && days < WEEKS * 7) buckets[WEEKS * 7 - 1 - days] += 1;
    });
    return buckets;
  }, [dates]);

  return (
    <div className="no-scrollbar overflow-x-auto">
      <div className="grid grid-flow-col grid-rows-7 gap-[3px]" style={{ gridAutoColumns: '10px' }}>
        {cells.map((v, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 60) * 0.004, duration: 0.3 }}
            className={cn(
              'h-[10px] w-[10px] rounded-[2px]',
              v === 0 && 'bg-white/[0.05]',
              v === 1 && 'bg-cyan-500/40',
              v === 2 && 'bg-cyan-400/65',
              v >= 3 && 'bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.7)]',
            )}
            title={v ? `${v} repository update(s)` : 'No recorded update'}
          />
        ))}
      </div>
    </div>
  );
}

export function GitHubSection() {
  const { status, user, repos } = useGitHub();

  return (
    <section id="github" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="section-shell">
        <SectionHeading
          eyebrow="11 — Open Source"
          title="Open Source & GitHub"
          subtitle="Where the notebooks, queries and dashboard files live."
        />

        <Reveal className="mt-14">
          <TiltCard intensity={4}>
            <GlassCard strong className="relative overflow-hidden rounded-3xl p-6 sm:p-8">
              <span className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <motion.span
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-cyan-300/30 bg-cyan-400/10 text-cyan-100 shadow-glow"
                  >
                    <GithubIcon className="h-8 w-8" />
                  </motion.span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink">
                      {user?.name ?? profile.fullName}
                    </h3>
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="font-mono text-xs text-cyan-200/90 transition hover:text-cyan-100"
                    >
                      @{profile.githubUser}
                    </a>
                    {user?.bio && <p className="mt-1 max-w-md text-xs text-ink-muted">{user.bio}</p>}
                  </div>
                </div>

                {status === 'ready' && user ? (
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Public Repos', value: user.public_repos, icon: Boxes },
                      { label: 'Followers', value: user.followers, icon: Users },
                      { label: 'Following', value: user.following, icon: Users },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="rounded-xl border border-white/8 bg-white/[0.035] px-4 py-3 text-center">
                        <Icon className="mx-auto h-3.5 w-3.5 text-cyan-300/80" />
                        <div className="mt-1 font-display text-lg font-bold text-ink">{value}</div>
                        <div className="font-mono text-[0.55rem] tracking-[0.15em] text-ink-faint uppercase">{label}</div>
                      </div>
                    ))}
                  </div>
                ) : status === 'loading' ? (
                  <div className="flex items-center gap-2 text-xs text-ink-faint">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" /> Fetching live GitHub data…
                  </div>
                ) : (
                  <div className="flex max-w-xs items-start gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[0.7rem] text-ink-muted">
                    <CloudOff className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" />
                    Live GitHub statistics could not be loaded right now, so no counts are shown here. Open the profile for
                    the current numbers.
                  </div>
                )}
              </div>

              {/* repositories */}
              <div className="relative mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                <div>
                  <h4 className="mb-3 font-mono text-[0.62rem] tracking-[0.25em] text-ink-faint uppercase">
                    Public repositories
                  </h4>
                  {status === 'ready' && repos.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {repos.map((repo, i) => (
                        <motion.a
                          key={repo.id}
                          href={repo.html_url}
                          target="_blank"
                          rel="noreferrer noopener"
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.06, duration: 0.5 }}
                          whileHover={{ y: -4 }}
                          className="group flex flex-col rounded-xl border border-white/8 bg-white/[0.03] p-4 transition hover:border-cyan-300/35"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="truncate font-display text-sm font-semibold text-ink">{repo.name}</span>
                            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-ink-faint transition group-hover:text-cyan-200" />
                          </div>
                          <p className="mt-1 line-clamp-2 text-[0.72rem] leading-relaxed text-ink-muted">
                            {repo.description ?? 'No description provided.'}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-[0.62rem] text-ink-faint">
                            {repo.language && (
                              <span className="inline-flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-cyan-300" /> {repo.language}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1">
                              <Star className="h-3 w-3" /> {repo.stargazers_count}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <GitFork className="h-3 w-3" /> {repo.forks_count}
                            </span>
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  ) : status === 'loading' ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-28 animate-pulse rounded-xl border border-white/8 bg-white/[0.03]" />
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-[0.72rem] text-ink-muted">
                      <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" />
                      Repository data is fetched live from the GitHub API and is unavailable at the moment. Nothing is
                      shown here rather than placeholder repositories.
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-4">
                  <h4 className="mb-3 font-mono text-[0.62rem] tracking-[0.25em] text-ink-faint uppercase">
                    Repository update activity
                  </h4>
                  {status === 'ready' ? (
                    <>
                      <ActivityGrid dates={repos.map((r) => r.updated_at)} />
                      <p className="mt-3 text-[0.62rem] leading-relaxed text-ink-faint">
                        Built from the last-updated timestamps of public repositories returned by the GitHub API — it is
                        not a commit contribution graph.
                      </p>
                    </>
                  ) : (
                    <p className="text-[0.7rem] text-ink-muted">
                      Activity visualisation appears when live GitHub data is available.
                    </p>
                  )}
                </div>
              </div>

              <div className="relative mt-8 flex flex-wrap items-center gap-3">
                <MagneticButton as="a" href={profile.github} target="_blank" icon={<GithubIcon className="h-4 w-4" />}>
                  Explore My GitHub
                </MagneticButton>
                <span className="font-mono text-[0.65rem] text-ink-faint">{profile.github}</span>
              </div>
            </GlassCard>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
}
