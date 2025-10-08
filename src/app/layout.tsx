import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { QueryProvider } from '@/components/providers/query-provider';
import { ToastProvider } from '@/components/providers/toast-provider';
import { ModalProvider } from '@/contexts/modal-context';
import { Header } from '@/components/layout/header';
import { Nav } from '@/components/layout/nav';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
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
        <QueryProvider>
          <ModalProvider>
            <div className="min-h-screen bg-gradient-to-br from-primary to-secondary">
              <Header />
              <Nav />
              <main className="container mx-auto px-4 py-8">{children}</main>
            </div>
            <ToastProvider />
          </ModalProvider>
        </QueryProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
