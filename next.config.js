import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      // Production domain
      {
        hostname: 'eljardisalomo.com',
        protocol: 'https',
      },
      {
        hostname: 'www.eljardisalomo.com',
        protocol: 'https',
      },
      // MinIO storage (production)
      {
        hostname: 'minio-api.coolify.eljardisalomo.com',
        protocol: 'https',
      },
      // Local development
      {
        hostname: 'localhost',
        protocol: 'http',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    // Permitir importar SVGs (p.ej. iconos) como URL estática
    webpackConfig.module.rules.push({
      test: /\.svg$/i,
      type: 'asset/resource',
    })

    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
