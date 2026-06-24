'use client';

import { useEffect } from 'react';

export function RegisterSW() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.location.protocol === 'https:'
    ) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' });
    }
  }, []);

  return null;
}
