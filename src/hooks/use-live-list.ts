'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

export function useLiveList(tableName: string) {
  return useLiveQuery(
    () => db.table(tableName).orderBy('nome').toArray(),
    [tableName]
  );
}
