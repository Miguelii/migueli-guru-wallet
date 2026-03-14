import type { NextConfig } from 'next'

const buildTimestamp = Date.now().toString()

const nextConfig: NextConfig = {
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

export default nextConfig
