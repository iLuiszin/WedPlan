'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';
import { ModalProvider } from '@/contexts/modal-context';
import { MainErrorFallback } from '@/components/errors/main-error-fallback';

const ReactQueryDevtools = dynamic(
  () => import('@tanstack/react-query-devtools').then(m => ({ default: m.ReactQueryDevtools })),
  { ssr: false }
);

const ToastProvider = dynamic(
  () => import('@/components/providers/toast-provider').then(m => ({ default: m.ToastProvider })),
  { ssr: false }
);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          {children}
          {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
          <ToastProvider />
        </ModalProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
