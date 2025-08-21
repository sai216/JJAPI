/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer, webpack }) => {
    // client-only polyfills
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        util: require.resolve('util'),
        url: require.resolve('url'),
        assert: require.resolve('assert'),
        process: require.resolve('process/browser'),
      };
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: ['process/browser'],
        })
      );
      // keep server-only libs OUT of client bundle
      config.resolve.alias = {
        ...config.resolve.alias,
        '@injectivelabs/token-metadata': false,
        '@injectivelabs/sdk-ts': false,
      };
    }

    // don’t set externals for client here (causes runtime misses)
    config.externals = [...(config.externals || [])];

    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },

  transpilePackages: ['@certusone/wormhole-sdk', '@coinbase/onchainkit'],
};

module.exports = nextConfig;
