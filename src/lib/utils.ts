import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { HOME_PAGE_URL, STATIC_PREFIXES } from '@/lib/constants'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getBuildId = () => {
    return process.env.NEXT_PUBLIC_BUILD_TIMESTAMP ?? '1'
}

export const normalizePath = (path: string) => path.replace(/\/$/, '') || HOME_PAGE_URL

export const isPathFromStaticFiles = (pathname: string): boolean => {
    return STATIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}
