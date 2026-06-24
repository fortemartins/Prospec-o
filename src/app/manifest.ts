import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GFM Eventos - Prospecção',
    short_name: 'GFM Prospecção',
    description: 'App de prospecção para feiras corporativas - GFM Eventos',
    id: '/',
    start_url: '/',
    display: 'standalone',
    background_color: '#102a43',
    theme_color: '#102a43',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
