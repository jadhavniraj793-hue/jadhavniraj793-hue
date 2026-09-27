import { projects, type Project } from '../../data/portfolio';
import { SectionHeading } from '../ui/SectionHeading';
import { ProjectCard } from './ProjectCard';

export function Projects({ onOpen }: { onOpen: (p: Project) => void }) {
  return (
    <section id="projects" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="section-shell">
        <SectionHeading
          eyebrow="04 — Case Studies"
          title="Featured Analytics Projects"
          subtitle="Turning raw data into meaningful business insights."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}
