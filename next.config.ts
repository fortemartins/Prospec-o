import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  cacheOnNavigation: true,
  reloadOnOnline: true,
  register: false,
  disable: process.env.NODE_ENV !== 'production',
});

export default withSerwist({
  reactStrictMode: true,
  bundlePagesRouterDependencies: true,
  turbopack: {},
});
