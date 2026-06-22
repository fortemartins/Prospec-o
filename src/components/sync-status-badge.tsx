'use client';

import { useSync } from '@/hooks/use-sync';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { CloudIcon, CloudOffIcon, LoaderIcon, RefreshCwIcon } from 'lucide-react';

export function SyncStatusBadge() {
  const isOnline = useOnlineStatus();
  const { isSyncing, unsyncedCount, triggerSync } = useSync();

  const baseClass = 'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium';

  if (isSyncing) {
    return (
      <span className={`${baseClass} bg-white/15 text-white/90`}>
        <LoaderIcon className="h-3 w-3 animate-spin" />
        Sincronizando
      </span>
    );
  }

  if (!isOnline) {
    return (
      <span className={`${baseClass} bg-red-500/20 text-red-300`}>
        <CloudOffIcon className="h-3 w-3" />
        Offline
        {unsyncedCount > 0 && ` (${unsyncedCount})`}
      </span>
    );
  }

  if (unsyncedCount > 0) {
    return (
      <button onClick={triggerSync} type="button">
        <span className={`${baseClass} bg-[#f0a500]/20 text-[#f0a500] cursor-pointer`}>
          <RefreshCwIcon className="h-3 w-3" />
          {unsyncedCount} pendente(s)
        </span>
      </button>
    );
  }

  return (
    <span className={`${baseClass} bg-emerald-500/20 text-emerald-300`}>
      <CloudIcon className="h-3 w-3" />
      Online
    </span>
  );
}
