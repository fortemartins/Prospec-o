'use client';

import { useSync } from '@/hooks/use-sync';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { Badge } from '@/components/ui/badge';
import { CloudIcon, CloudOffIcon, LoaderIcon, RefreshCwIcon } from 'lucide-react';

export function SyncStatusBadge() {
  const isOnline = useOnlineStatus();
  const { isSyncing, unsyncedCount, triggerSync } = useSync();

  if (isSyncing) {
    return (
      <Badge variant="secondary" className="gap-1">
        <LoaderIcon className="h-3 w-3 animate-spin" />
        Sincronizando
      </Badge>
    );
  }

  if (!isOnline) {
    return (
      <Badge variant="destructive" className="gap-1">
        <CloudOffIcon className="h-3 w-3" />
        Offline
        {unsyncedCount > 0 && ` (${unsyncedCount})`}
      </Badge>
    );
  }

  if (unsyncedCount > 0) {
    return (
      <button onClick={triggerSync} type="button">
        <Badge variant="secondary" className="gap-1 cursor-pointer">
          <RefreshCwIcon className="h-3 w-3" />
          {unsyncedCount} pendente(s)
        </Badge>
      </button>
    );
  }

  return (
    <Badge variant="outline" className="gap-1 text-green-600 border-green-200">
      <CloudIcon className="h-3 w-3" />
      Online
    </Badge>
  );
}
