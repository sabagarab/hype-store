const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

/**
 * Medusa Cloud-related environment variables
 */
const S3_HOSTNAME = process.env.MEDUSA_CLOUD_S3_HOSTNAME
const S3_PATHNAME = process.env.MEDUSA_CLOUD_S3_PATHNAME

/**
 * Production product image host (e.g. public Cloudflare R2 URL), as a full URL
 * like https://pub-xxxx.r2.dev or https://cdn.example.com/products.
 * Images under that URL are allowed through the image optimizer.
 */
const imageHostPattern = (value) => {
  if (!value) {
    return []
  }

  const url = new URL(value)
  const path = url.pathname.replace(/\/$/, "")

  return [
    {
      protocol: url.protocol.replace(":", ""),
      hostname: url.hostname,
      ...(url.port && { port: url.port }),
      pathname: `${path}/**`,
    },
  ]
}

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // 50: product thumbnails (src/modules/products/components/thumbnail); 75: default.
    qualities: [50, 75],
    remotePatterns: [
      // Admin uploads served by the local Medusa backend (dev only).
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/static/**",
      },
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      },
      ...(S3_HOSTNAME && S3_PATHNAME
        ? [
            {
              protocol: "https",
              hostname: S3_HOSTNAME,
              pathname: S3_PATHNAME,
            },
          ]
        : []),
      ...imageHostPattern(process.env.IMAGE_HOST_URL),
    ],
  },
}

module.exports = nextConfig
