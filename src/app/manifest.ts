import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GFM Eventos - Prospecção',
    short_name: 'GFM Prospecção',
    description: 'App de prospecção para feiras corporativas - GFM Eventos',
    start_url: '/',
    display: 'standalone',
    background_color: '#102a43',
    theme_color: '#102a43',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/icons/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
  };
}
