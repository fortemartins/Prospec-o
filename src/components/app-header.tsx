'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
    <header className="sticky top-0 z-40 bg-[#102a43] text-white shadow-md">
      <div className="flex h-14 items-center gap-3 px-4">
        {showBack ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="shrink-0 text-white hover:bg-white/10 hover:text-white"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
        ) : (
          <Image
            src="/logo-gfm.png"
            alt="GFM Eventos"
            width={120}
            height={38}
            priority
          />
        )}
        <h1 className="flex-1 truncate text-base font-semibold">
          {showBack ? title : ''}
        </h1>
        <SyncStatusBadge />
      </div>
      {showBack && (
        <div className="h-1 bg-gradient-to-r from-[#f0a500] via-[#f0a500] to-transparent" />
      )}
    </header>
  );
}
