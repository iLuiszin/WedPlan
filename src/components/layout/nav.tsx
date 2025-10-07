'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Nav() {
  const pathname = usePathname();

  const projectIdMatch = pathname.match(/^\/project\/([^/]+)/);
  const projectId = projectIdMatch?.[1];

  if (!projectId) {
    return null;
  }

  const links = [
    { href: `/project/${projectId}`, label: 'Dashboard' },
    { href: `/project/${projectId}/guests`, label: 'Convidados' },
    { href: `/project/${projectId}/budgets`, label: 'Orçamentos' },
  ];

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-6 py-3 font-semibold transition-colors rounded-t-lg',
                pathname === link.href
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
