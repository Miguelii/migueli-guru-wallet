import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { HOME_PAGE_URL } from '@/lib/constants'
import type { TickerData } from '@/types/Transaction'
import { formatDate } from './formaters'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/** @public */
export const getBuildId = () => {
    return process.env.NEXT_PUBLIC_BUILD_TIMESTAMP ?? '1'
}

/** @public */
export const normalizePath = (path: string) => path.replace(/\/$/, '') || HOME_PAGE_URL

export function getLatestUpdate(data: TickerData[]): string {
    if (data.length === 0) return '—'
    const latest = data.reduce((a, b) => (a.last_updated_at > b.last_updated_at ? a : b), data[0])
    return formatDate(latest.last_updated_at)
}
