import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
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
      <body className={inter.className}>
        <AppProvider>
          <div className="min-h-screen bg-gradient-to-br from-primary to-secondary">
            <Header />
            <Nav />
            <main className="container mx-auto px-4 py-8">{children}</main>
          </div>
        </AppProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
