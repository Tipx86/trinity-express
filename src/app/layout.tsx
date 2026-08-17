import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Trinity Express — Book Bus Tickets Online | Kigali, Kampala, Nairobi, Juba',
  description: 'Trinity Express offers safe, reliable cross-border bus travel from Kigali to Kampala, Nairobi, Juba, Mombasa and more. Book your seat online, choose your seat in real time, and pay via M-Pesa or Airtel Money.',
  keywords: [
    'Trinity Express',
    'Trinity Express bus booking',
    'bus tickets Kigali Kampala',
    'bus tickets Kigali Nairobi',
    'bus tickets Kampala Juba',
    'bus tickets Nairobi Mombasa',
    'East Africa cross border bus',
    'bus booking Rwanda Uganda Kenya South Sudan',
    'cheap bus tickets East Africa',
    'online bus tickets Rwanda',
    'Nyabugogo bus terminal',
    'Namayiba bus terminal Kampala',
    'River Road bus Nairobi',
  ],
  authors: [{ name: 'Trinity Express Transportation Ltd' }],
  metadataBase: new URL('https://trinityexpresss.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Trinity Express — Book Bus Tickets Online Across East Africa',
    description: 'Book cross-border bus tickets online across Rwanda, Uganda, Kenya, and South Sudan with Trinity Express. Real-time seat selection & digital tickets.',
    url: 'https://trinityexpresss.com',
    siteName: 'Trinity Express',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Trinity Express Luxury Cross-Border Fleet',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trinity Express — Book Bus Tickets Online',
    description: 'Cross-border bus tickets: Kigali, Kampala, Nairobi, Juba. Book online, pick your seat, pay with M-Pesa.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen flex flex-col bg-trinity-navy-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
