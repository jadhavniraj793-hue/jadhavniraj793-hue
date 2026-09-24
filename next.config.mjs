/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // three.js ships ESM-only builds that Next optimises cleanly when transpiled.
  transpilePackages: ['three'],

  // The 3D bundle is heavy: keep it out of the server build graph where possible.
  experimental: {
    optimizePackageImports: ['lucide-react', '@react-three/drei'],
  },

  // Dev-server origins allowed to hit the app (live-preview proxies, LAN devices).
  allowedDevOrigins: ['*.e2b.app', '*.arena.ai', 'localhost', '127.0.0.1'],

  async headers() {
    return [
      {
        // Long-cache the immutable generated artwork / resume asset.
        source: '/:all*(svg|jpg|png|pdf|webp|avif|ico|woff2)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
