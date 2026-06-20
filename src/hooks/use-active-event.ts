'use client';

import { useState, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { getActiveEventId, setActiveEventId } from '@/lib/active-event';
import type { Evento } from '@/lib/types';

export function useActiveEvent() {
  const [eventId, setEventId] = useState<string | null>(() => getActiveEventId());

  const evento = useLiveQuery(
    () => (eventId ? db.eventos.get(eventId) : undefined),
    [eventId]
  );

  const selectEvent = useCallback((id: string) => {
    setActiveEventId(id);
    setEventId(id);
  }, []);

  return {
    eventId,
    evento: evento as Evento | undefined,
    selectEvent,
    hasEvent: !!eventId,
  };
}
