import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { cn, getBuildId, getLatestUpdate } from '@/lib/utils'
import type { TickerData } from '@/types/Transaction'
import { Ticker } from '@/types/Transaction'

// ─── cn ──────────────────────────────────────────────────────────────────────

describe('cn', () => {
    it('should merge simple class strings', () => {
        expect(cn('text-sm', 'font-bold')).toBe('text-sm font-bold')
    })

    it('should resolve conflicting Tailwind classes (last wins)', () => {
        expect(cn('p-2', 'p-4')).toBe('p-4')
    })

    it('should handle conditional object syntax', () => {
        expect(cn('text-xs', { 'text-success': true, 'text-destructive': false })).toBe(
            'text-xs text-success'
        )
    })

    it('should filter out falsy values', () => {
        expect(cn('base', undefined, null, false, 'active')).toBe('base active')
    })

    it('should handle arrays', () => {
        expect(cn(['flex', 'gap-2'], 'items-center')).toBe('flex gap-2 items-center')
    })

    it('should return empty string for no inputs', () => {
        expect(cn()).toBe('')
    })
})

// ─── getBuildId ──────────────────────────────────────────────────────────────

describe('getBuildId', () => {
    const originalEnv = process.env.NEXT_PUBLIC_BUILD_TIMESTAMP

    beforeEach(() => {
        delete process.env.NEXT_PUBLIC_BUILD_TIMESTAMP
    })

    afterEach(() => {
        if (originalEnv !== undefined) {
            process.env.NEXT_PUBLIC_BUILD_TIMESTAMP = originalEnv
        } else {
            delete process.env.NEXT_PUBLIC_BUILD_TIMESTAMP
        }
    })

    it('should return the env variable when set', () => {
        process.env.NEXT_PUBLIC_BUILD_TIMESTAMP = '20260317'
        expect(getBuildId()).toBe('20260317')
    })

    it('should fall back to "1" when env variable is not set', () => {
        expect(getBuildId()).toBe('1')
    })
})

// ─── getLatestUpdate ─────────────────────────────────────────────────────────

const baseTicker: Omit<TickerData, 'ticker' | 'last_updated_at'> = {
    curr_price: 2000,
    service: 'coinbase',
    currency: 'EUR',
    symbol: '€',
    logo: '/assets/ethereum.webp',
    hex_color: '#627EEA' as TickerData['hex_color'],
    type: 'CRYPTO',
}

describe('getLatestUpdate', () => {
    it('should return "—" for empty array', () => {
        expect(getLatestUpdate([])).toBe('—')
    })

    it('should return the timestamp of a single entry', () => {
        const data: TickerData[] = [
            { ...baseTicker, ticker: Ticker.ETH, last_updated_at: '2026-03-17 10:00:00' },
        ]
        expect(getLatestUpdate(data)).toBe('2026-03-17 10:00:00')
    })

    it('should return the most recent timestamp', () => {
        const data: TickerData[] = [
            { ...baseTicker, ticker: Ticker.ETH, last_updated_at: '2026-03-15 08:00:00' },
            { ...baseTicker, ticker: Ticker.SOL, last_updated_at: '2026-03-17 12:00:00' },
            { ...baseTicker, ticker: Ticker.BTC, last_updated_at: '2026-03-16 09:00:00' },
        ]
        expect(getLatestUpdate(data)).toBe('2026-03-17 12:00:00')
    })

    it('should handle entries with the same timestamp', () => {
        const data: TickerData[] = [
            { ...baseTicker, ticker: Ticker.ETH, last_updated_at: '2026-03-17 10:00:00' },
            { ...baseTicker, ticker: Ticker.SOL, last_updated_at: '2026-03-17 10:00:00' },
        ]
        expect(getLatestUpdate(data)).toBe('2026-03-17 10:00:00')
    })
})
