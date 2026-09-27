import { creativeProjects, type Project } from '../../data/portfolio';
import { SectionHeading } from '../ui/SectionHeading';
import { ProjectCard } from './ProjectCard';
import { Reveal } from '../ui/Reveal';
import { DemoBadge } from '../ui/DemoBadge';

export function CreativeProjects({ onOpen }: { onOpen: (p: Project) => void }) {
  return (
    <section id="creative" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="section-shell">
        <SectionHeading
          eyebrow="05 — Lab Builds"
          title="Creative Analytics Projects"
          subtitle="Real-world data problems transformed into interactive insights."
        />
        <Reveal className="mt-6 flex justify-center">
          <DemoBadge label="Portfolio Demo Projects — simulated data" />
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {creativeProjects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} onOpen={onOpen} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
}
