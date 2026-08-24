import type { Metadata } from 'next';
import { DM_Sans, Geist_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const playfair = Playfair_Display({ variable: '--font-display', subsets: ['latin'] });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Le Thanh Tung — AI Engineer',
  description: 'Le Thanh Tung builds practical AI products across speech, audio, data and production APIs.',
  openGraph: {
    title: 'Le Thanh Tung — AI Engineer',
    description: 'AI ideas into production.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Le Thanh Tung — AI Engineer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Le Thanh Tung — AI Engineer',
    description: 'AI ideas into production.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${dmSans.variable} ${geistMono.variable} ${playfair.variable}`}>{children}</body></html>;
}
