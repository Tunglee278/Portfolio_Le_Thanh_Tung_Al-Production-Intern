import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Le Thanh Tung — AI Engineer',
  description: 'AI Engineer building production-minded systems across speech, computer vision, RAG and data.',
  openGraph: {
    title: 'Le Thanh Tung — AI Engineer',
    description: 'From model to meaningful outcome.',
    images: [{ url: '/og.png', width: 1731, height: 909, alt: 'Le Thanh Tung — AI Engineer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Le Thanh Tung — AI Engineer',
    description: 'From model to meaningful outcome.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
