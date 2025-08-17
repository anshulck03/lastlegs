/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        'undici': 'commonjs undici'
      })
    }
    return config
  }
  // If you load external images, add patterns here:
  // images: {
  //   remotePatterns: [
  //     { protocol: "https", hostname: "images.ctfassets.net" },
  //     { protocol: "https", hostname: "cdn.yourhost.com" },
  //   ],
  // },
};

module.exports = nextConfig
