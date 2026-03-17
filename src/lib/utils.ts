import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { TickerData } from '@/types/Transaction'

/**
 * Merges Tailwind CSS classes with `clsx` and `tailwind-merge`,
 * resolving conflicts (e.g. `p-2` vs `p-4`) automatically.
 * @param inputs - Class values (strings, objects, arrays) to merge.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Returns the build timestamp used for cache-busting.
 * Falls back to `'1'` in local development.
 * @public
 */
export const getBuildId = () => {
    return process.env.NEXT_PUBLIC_BUILD_TIMESTAMP ?? '1'
}

/**
 * Finds the most recently updated ticker and returns its `last_updated_at` timestamp.
 * Returns `'—'` when the data array is empty.
 * @param data - Array of ticker data entries.
 */
export function getLatestUpdate(data: TickerData[]): string {
    if (data.length === 0) return '—'
    const latest = data.reduce((a, b) => (a.last_updated_at > b.last_updated_at ? a : b), data[0])
    return latest.last_updated_at
}
