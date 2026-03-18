import type { NextConfig } from 'next'
import { withBotId } from 'botid/next/config'

const buildTimestamp = Date.now().toString()

const nextConfig: NextConfig = {
    experimental: {
        optimizePackageImports: [
            '@base-ui/react',
            '@hookform/resolvers',
            'class-variance-authority',
            'clsx',
            'react-hook-form',
            'shadcn',
            'sonner',
            'tailwind-merge',
            'tw-animate-css',
            'zod',
            'effect',
            '@tanstack/react-virtual',
        ],
    },
    reactCompiler: true,
    images: {
        qualities: [25, 50, 75, 100],
        localPatterns: [
            {
                pathname: '/assets/**',
            },
        ],
        remotePatterns: [
            { hostname: 'assets.coingecko.com' },
            { hostname: 's3-symbol-logo.tradingview.com' },
            { hostname: 'www.vanguard.co.uk' },
            { hostname: 'via.placeholder.com' },
        ],
        minimumCacheTTL: 2678400, // 31 days
    },
    env: {
        NEXT_PUBLIC_BUILD_TIMESTAMP: buildTimestamp,
    },
}

export default withBotId(nextConfig)
