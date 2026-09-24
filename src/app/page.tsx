import type { Metadata } from 'next';
import { About } from '@/components/sections/About';
import { Certifications } from '@/components/sections/Certifications';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';
import { Hero } from '@/components/sections/Hero';
import { Journey } from '@/components/sections/Journey';
import { Projects } from '@/components/sections/Projects';
import { Skills } from '@/components/sections/Skills';
import { profile } from '@/lib/data';

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.title}`,
  description: profile.tagline,
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Journey />
      <Certifications />
      <Contact />
      <Footer />
    </>
  );
}
