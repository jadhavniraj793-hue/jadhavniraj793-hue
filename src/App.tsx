import { motion } from 'framer-motion';
import { About } from './components/About';
import { Certifications } from './components/Certifications';
import { Contact } from './components/Contact';
import { DataUniverse } from './components/DataUniverse';
import { Education } from './components/Education';
import { Experience } from './components/Experience';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { Projects } from './components/Projects';
import { ResumeSection } from './components/ResumeSection';
import { Skills } from './components/Skills';

export default function App() {
  return (
    <div className="relative min-h-screen bg-void text-slate-300">
      {/* global ambient backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(76,29,149,0.28),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_85%_110%,rgba(14,116,144,0.16),transparent_65%)]" />
        <motion.div
          animate={{ y: [0, 40, 0], x: [0, -25, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-[8%] top-[38%] h-72 w-72 rounded-full bg-violet-600/8 blur-[120px]"
        />
        <motion.div
          animate={{ y: [0, -35, 0], x: [0, 30, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-[6%] top-[62%] h-80 w-80 rounded-full bg-cyan-500/8 blur-[130px]"
        />
      </div>

      <Navbar />

      <main>
        <Hero />
        <About />
        <Skills />
        <DataUniverse />
        <Projects />
        <Certifications />
        <Experience />
        <Education />
        <ResumeSection />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
