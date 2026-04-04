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
            'usehooks-ts',
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
        minimumCacheTTL: 2678400, // 31 days
    },
    env: {
        NEXT_PUBLIC_BUILD_TIMESTAMP: buildTimestamp,
    },
}

export default withBotId(nextConfig)
