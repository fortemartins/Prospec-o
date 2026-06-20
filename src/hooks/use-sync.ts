'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { fullSync, getUnsyncedCount } from '@/lib/sync';
import { useOnlineStatus } from './use-online-status';

interface SyncState {
  isSyncing: boolean;
  lastSyncAt: Date | null;
  unsyncedCount: number;
  triggerSync: () => void;
}

export function useSync(): SyncState {
  const isOnline = useOnlineStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null);
  const [unsyncedCount, setUnsyncedCount] = useState(0);
  const syncingRef = useRef(false);

  const updateUnsyncedCount = useCallback(async () => {
    const count = await getUnsyncedCount();
    setUnsyncedCount(count);
  }, []);

  const doSync = useCallback(async () => {
    if (syncingRef.current || !navigator.onLine) return;
    syncingRef.current = true;
    setIsSyncing(true);
    try {
      await fullSync();
      setLastSyncAt(new Date());
    } catch (e) {
      console.error('Sync failed:', e);
    } finally {
      setIsSyncing(false);
      syncingRef.current = false;
      await updateUnsyncedCount();
    }
  }, [updateUnsyncedCount]);

  useEffect(() => {
    updateUnsyncedCount();
  }, [updateUnsyncedCount]);

  useEffect(() => {
    if (isOnline) {
      doSync();
    }
  }, [isOnline, doSync]);

  useEffect(() => {
    if (!isOnline) return;
    const interval = setInterval(() => {
      doSync();
    }, 60_000);
    return () => clearInterval(interval);
  }, [isOnline, doSync]);

  return {
    isSyncing,
    lastSyncAt,
    unsyncedCount,
    triggerSync: doSync,
  };
}
