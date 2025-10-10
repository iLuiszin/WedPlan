import type { Metadata } from 'next';
import { Inter, Montserrat, Great_Vibes } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { AppProvider } from '@/app/provider';
import { Header } from '@/components/layouts/header';
import { Nav } from '@/components/layouts/nav';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
  adjustFontFallback: true,
  fallback: ['system-ui', 'arial'],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700', '800'],
});

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-great-vibes',
  weight: ['400'],
});

export const metadata: Metadata = {
  title: 'WedPlan',
  description: 'Gerencie seus convidados e orçamentos de casamento',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${montserrat.variable} ${greatVibes.variable} font-sans`}>
        <AppProvider>
          <div className="min-h-screen bg-cream">
            <Header />
            <Nav />
            {/* Remove container restriction for homepage, add it conditionally for other pages */}
            <main className="w-full">{children}</main>
          </div>
        </AppProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
