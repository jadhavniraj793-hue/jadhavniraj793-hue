import { Suspense, lazy, useCallback, useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { CursorGlow } from './components/layout/CursorGlow';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Deferred } from './components/ui/Deferred';
import type { Project } from './data/portfolio';

const Skills = lazy(() => import('./components/sections/Skills').then((m) => ({ default: m.Skills })));
const AnalyticsLab = lazy(() => import('./components/sections/AnalyticsLab').then((m) => ({ default: m.AnalyticsLab })));
const Projects = lazy(() => import('./components/sections/Projects').then((m) => ({ default: m.Projects })));
const CreativeProjects = lazy(() =>
  import('./components/sections/CreativeProjects').then((m) => ({ default: m.CreativeProjects })),
);
const Experience = lazy(() => import('./components/sections/Experience').then((m) => ({ default: m.Experience })));
const Education = lazy(() => import('./components/sections/Education').then((m) => ({ default: m.Education })));
const Certifications = lazy(() =>
  import('./components/sections/Certifications').then((m) => ({ default: m.Certifications })),
);
const Process = lazy(() => import('./components/sections/Process').then((m) => ({ default: m.Process })));
const WhyAnalytics = lazy(() => import('./components/sections/WhyAnalytics').then((m) => ({ default: m.WhyAnalytics })));
const GitHubSection = lazy(() => import('./components/sections/GitHubSection').then((m) => ({ default: m.GitHubSection })));
const Contact = lazy(() => import('./components/sections/Contact').then((m) => ({ default: m.Contact })));
const Footer = lazy(() => import('./components/layout/Footer').then((m) => ({ default: m.Footer })));
const ProjectModal = lazy(() => import('./components/sections/ProjectModal').then((m) => ({ default: m.ProjectModal })));

function SectionFallback({ height = 560 }: { height?: number }) {
  return (
    <div className="section-shell py-16" style={{ minHeight: height }}>
      <div className="glass h-full min-h-[18rem] animate-pulse rounded-3xl opacity-40" />
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState<Project | null>(null);
  const openProject = useCallback((project: Project) => setActive(project), []);
  const closeProject = useCallback(() => setActive(null), []);

  return (
    <>
      <span className="noise-overlay" aria-hidden />
      <CursorGlow />
      <Navbar />

      <main id="main">
        <Hero />
        <About />

        <Deferred minHeight={760} anchorId="skills">
          <Suspense fallback={<SectionFallback height={760} />}>
            <Skills />
          </Suspense>
        </Deferred>

        <Deferred minHeight={900} anchorId="analytics-lab">
          <Suspense fallback={<SectionFallback height={900} />}>
            <AnalyticsLab />
          </Suspense>
        </Deferred>

        <Deferred minHeight={820} anchorId="projects">
          <Suspense fallback={<SectionFallback height={820} />}>
            <Projects onOpen={openProject} />
          </Suspense>
        </Deferred>

        <Deferred minHeight={820} anchorId="creative">
          <Suspense fallback={<SectionFallback height={820} />}>
            <CreativeProjects onOpen={openProject} />
          </Suspense>
        </Deferred>

        <Deferred minHeight={620} anchorId="experience">
          <Suspense fallback={<SectionFallback height={620} />}>
            <Experience />
          </Suspense>
        </Deferred>

        <Deferred minHeight={720} anchorId="education">
          <Suspense fallback={<SectionFallback height={720} />}>
            <Education />
          </Suspense>
        </Deferred>

        <Deferred minHeight={680} anchorId="certifications">
          <Suspense fallback={<SectionFallback height={680} />}>
            <Certifications />
          </Suspense>
        </Deferred>

        <Deferred minHeight={520} anchorId="process">
          <Suspense fallback={<SectionFallback height={520} />}>
            <Process />
          </Suspense>
        </Deferred>

        <Deferred minHeight={520} anchorId="approach">
          <Suspense fallback={<SectionFallback height={520} />}>
            <WhyAnalytics />
          </Suspense>
        </Deferred>

        <Deferred minHeight={760} anchorId="github">
          <Suspense fallback={<SectionFallback height={760} />}>
            <GitHubSection />
          </Suspense>
        </Deferred>

        <Deferred minHeight={760} anchorId="contact">
          <Suspense fallback={<SectionFallback height={760} />}>
            <Contact />
          </Suspense>
        </Deferred>
      </main>

      <Deferred minHeight={260}>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </Deferred>

      <Suspense fallback={null}>
        <ProjectModal project={active} onClose={closeProject} />
      </Suspense>
    </>
  );
}
