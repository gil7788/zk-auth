import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = {
      extensions: ['.ts', '.js'],
      fallback: {
        tty: false,
        path: false,
        net: false,
        crypto: false,
        util: require.resolve('util/'),
        assert: require.resolve('assert/'),
        buffer: require.resolve('buffer/'),
      },
    };
  }  

    return config;
  },
};

export default nextConfig;
