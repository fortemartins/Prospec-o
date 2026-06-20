const ACTIVE_EVENT_KEY = 'active_event_id';

export function getActiveEventId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_EVENT_KEY);
}

export function setActiveEventId(id: string): void {
  localStorage.setItem(ACTIVE_EVENT_KEY, id);
}

export function clearActiveEventId(): void {
  localStorage.removeItem(ACTIVE_EVENT_KEY);
}
