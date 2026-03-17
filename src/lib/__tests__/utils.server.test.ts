import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    isPathFromStaticFiles,
    createSbServerClient,
    sbProxy,
    verifyApiKey,
} from '@/lib/utils.server'
import { createServerClient } from '@supabase/ssr'
import { NextRequest } from 'next/server'

// Mock server-only
vi.mock('server-only', () => ({}))

// Mock next/headers (cookies)
const mockGetAll = vi.fn(() => [{ name: 'sb-token', value: 'abc' }])
const mockSet = vi.fn()
vi.mock('next/headers', () => ({
    cookies: vi.fn(async () => ({
        getAll: mockGetAll,
        set: mockSet,
    })),
}))

// Mock @supabase/ssr
const mockSupabaseClient = {
    auth: {
        getClaims: vi.fn(),
    },
}
vi.mock('@supabase/ssr', () => ({
    createServerClient: vi.fn(() => mockSupabaseClient),
}))

// Mock ServerEnv
vi.mock('@/env/server', () => ({
    ServerEnv: {
        NEXT_SUPABASE_URL: 'https://test.supabase.co',
        NEXT_SUPABASE_PUBLISHABLE_KEY: 'test-key',
    },
}))

// ─── isPathFromStaticFiles ───────────────────────────────────────────────────

describe('isPathFromStaticFiles', () => {
    it('should return true for /_next paths', () => {
        expect(isPathFromStaticFiles('/_next/static/chunk.js')).toBe(true)
    })

    it('should return true for /api/ paths', () => {
        expect(isPathFromStaticFiles('/api/updateTickers')).toBe(true)
    })

    it('should return true for /assets paths', () => {
        expect(isPathFromStaticFiles('/assets/ethereum.webp')).toBe(true)
    })

    it('should return true for /favicon paths', () => {
        expect(isPathFromStaticFiles('/favicon.ico')).toBe(true)
    })

    it('should return true for /robots.txt', () => {
        expect(isPathFromStaticFiles('/robots.txt')).toBe(true)
    })

    it('should return true for /script paths', () => {
        expect(isPathFromStaticFiles('/script/analytics.js')).toBe(true)
    })

    it('should return false for /portfolio', () => {
        expect(isPathFromStaticFiles('/portfolio')).toBe(false)
    })

    it('should return false for root path', () => {
        expect(isPathFromStaticFiles('/')).toBe(false)
    })

    it('should return false for arbitrary paths', () => {
        expect(isPathFromStaticFiles('/settings')).toBe(false)
    })
})

// ─── verifyApiKey ────────────────────────────────────────────────────────────

describe('verifyApiKey', () => {
    it('should return true for matching keys', () => {
        expect(verifyApiKey('my-secret-key', 'my-secret-key')).toBe(true)
    })

    it('should return false for different keys of same length', () => {
        expect(verifyApiKey('aaaa-bbbb-cccc', 'xxxx-yyyy-zzzz')).toBe(false)
    })

    it('should return false for keys of different lengths', () => {
        expect(verifyApiKey('short', 'much-longer-key')).toBe(false)
    })

    it('should return false for empty vs non-empty key', () => {
        expect(verifyApiKey('', 'secret')).toBe(false)
    })

    it('should return true for two empty strings', () => {
        expect(verifyApiKey('', '')).toBe(true)
    })
})

// ─── createSbServerClient ────────────────────────────────────────────────────

describe('createSbServerClient', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should call createServerClient with correct env values', async () => {
        await createSbServerClient()

        expect(createServerClient).toHaveBeenCalledWith(
            'https://test.supabase.co',
            'test-key',
            expect.objectContaining({
                cookies: expect.objectContaining({
                    getAll: expect.any(Function),
                    setAll: expect.any(Function),
                }),
            })
        )
    })

    it('should use cookieStore.getAll by default', async () => {
        await createSbServerClient()

        // Extract the getAll handler passed to createServerClient
        const cookieHandlers = vi.mocked(createServerClient).mock.calls[0][2].cookies as {
            getAll: () => { name: string; value: string }[]
        }
        const result = cookieHandlers.getAll()

        expect(mockGetAll).toHaveBeenCalled()
        expect(result).toEqual([{ name: 'sb-token', value: 'abc' }])
    })

    it('should call onGetAll hook after default getAll', async () => {
        const onGetAll = vi.fn()
        await createSbServerClient({ onGetAll })

        const cookieHandlers = vi.mocked(createServerClient).mock.calls[0][2].cookies as {
            getAll: () => { name: string; value: string }[]
        }
        cookieHandlers.getAll()

        expect(mockGetAll).toHaveBeenCalled()
        expect(onGetAll).toHaveBeenCalled()
    })

    it('should call onSetAll hook after default setAll', async () => {
        const onSetAll = vi.fn()
        await createSbServerClient({ onSetAll })

        const cookiesToSet = [{ name: 'sb-token', value: 'xyz', options: {} }]
        const cookieHandlers = vi.mocked(createServerClient).mock.calls[0][2].cookies as {
            setAll: (cookies: { name: string; value: string; options: object }[]) => void
        }
        cookieHandlers.setAll(cookiesToSet)

        expect(mockSet).toHaveBeenCalledWith('sb-token', 'xyz', {})
        expect(onSetAll).toHaveBeenCalledWith(cookiesToSet)
    })

    it('should swallow errors from cookieStore.set (Server Component context)', async () => {
        mockSet.mockImplementation(() => {
            throw new Error('Cannot set cookies in Server Component')
        })

        await createSbServerClient()

        const cookieHandlers = vi.mocked(createServerClient).mock.calls[0][2].cookies as {
            setAll: (cookies: { name: string; value: string; options: object }[]) => void
        }

        // Should not throw
        expect(() =>
            cookieHandlers.setAll([{ name: 'sb-token', value: 'xyz', options: {} }])
        ).not.toThrow()
    })
})

// ─── sbProxy ─────────────────────────────────────────────────────────────────

describe('sbProxy', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should return a response when user is authenticated', async () => {
        mockSupabaseClient.auth.getClaims.mockResolvedValue({
            data: { claims: { sub: 'user-123' } },
        })

        const request = new NextRequest('http://localhost:3000/portfolio')
        const response = await sbProxy(request)

        expect(response.status).toBe(200)
    })

    it('should redirect unauthenticated users from /portfolio to /', async () => {
        mockSupabaseClient.auth.getClaims.mockResolvedValue({
            data: { claims: null },
        })

        const request = new NextRequest('http://localhost:3000/portfolio')
        const response = await sbProxy(request)

        expect(response.status).toBe(307)
        expect(new URL(response.headers.get('location')!).pathname).toBe('/')
    })

    it('should not redirect unauthenticated users on public routes', async () => {
        mockSupabaseClient.auth.getClaims.mockResolvedValue({
            data: { claims: null },
        })

        const request = new NextRequest('http://localhost:3000/')
        const response = await sbProxy(request)

        expect(response.status).toBe(200)
    })
})
