import type { Metadata, Viewport } from 'next';
// Self-hosted variable fonts (no Google Fonts request at build or runtime).
import '@fontsource-variable/inter/index.css';
import '@fontsource-variable/jetbrains-mono/index.css';
import '@fontsource-variable/space-grotesk/index.css';
import { Backdrop } from '@/components/ui/Backdrop';
import { BackToTop } from '@/components/ui/BackToTop';
import { CursorGlow } from '@/components/ui/CursorGlow';
import { Nav } from '@/components/ui/Nav';
import { Preloader } from '@/components/ui/Preloader';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { SmoothScroll } from '@/components/providers/SmoothScroll';
import { profile } from '@/lib/data';
import './globals.css';

const description = `${profile.name} — ${profile.title}. ${profile.tagline} Skilled in Excel, SQL, Python, Power BI and Tableau.`;

export const metadata: Metadata = {
  metadataBase: new URL('https://niraj-jadhav.vercel.app'),
  title: {
    default: `${profile.name} — ${profile.title}`,
    template: `%s · ${profile.shortName}`,
  },
  description,
  keywords: [
    'Niraj Jadhav',
    'Data Analyst',
    'BI Specialist',
    'Power BI',
    'Tableau',
    'SQL',
    'Python',
    'Data Visualization',
    'Mumbai Data Analyst',
    'Business Intelligence',
  ],
  authors: [{ name: profile.name, url: profile.linkedin }],
  creator: profile.name,
  openGraph: {
    type: 'website',
    title: `${profile.name} — ${profile.title}`,
    description,
    url: '/',
    siteName: `${profile.shortName} · Data Cosmos`,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `${profile.name} portfolio` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} — ${profile.title}`,
    description,
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#050811',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative min-h-screen antialiased">
        <Backdrop />
        <Preloader />
        <SmoothScroll>
          <ScrollProgress />
          <CursorGlow />
          <Nav />
          <main id="content">{children}</main>
          <BackToTop />
        </SmoothScroll>
      </body>
    </html>
  );
}
