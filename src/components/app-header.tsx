'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SyncStatusBadge } from '@/components/sync-status-badge';
import { ArrowLeftIcon } from 'lucide-react';

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
}

export function AppHeader({ title, showBack }: AppHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-2 px-4">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="shrink-0"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
        )}
        <h1 className="flex-1 truncate text-lg font-semibold">{title}</h1>
        <SyncStatusBadge />
      </div>
    </header>
  );
}
