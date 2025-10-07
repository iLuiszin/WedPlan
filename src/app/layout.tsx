import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { QueryProvider } from '@/components/providers/query-provider';
import { ToastProvider } from '@/components/providers/toast-provider';
import { Header } from '@/components/layout/header';
import { Nav } from '@/components/layout/nav';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Wedding Organizer',
  description: 'Manage your wedding guests and budgets',
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
          <div className="min-h-screen bg-gradient-to-br from-primary to-secondary">
            <Header />
            <Nav />
            <main className="container mx-auto px-4 py-8">{children}</main>
          </div>
          <ToastProvider />
        </QueryProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
