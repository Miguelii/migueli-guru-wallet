import { TransactionType } from '@/types/Transaction'

/** @public */
export const NEXT_STATIC_PATH = '/_next/static'

export const NEXT_IMAGE_PATH = '/_next/image'

export const STATIC_PREFIXES = ['/_next', '/api/', '/assets', '/favicon', '/robots.txt', '/script']

export const HOME_PAGE_PATH = '/' as const

export const UPDATE_TICKERS_API_PATH = '/api/updateTickers' as const

export const PRIVATE_ROUTE_PATH = '/portfolio' as const

export const GET_DATA_CACHE_KEY = 'getData'

export const GET_DATA_REVALIDATE_TIME = 14400 // 4h

export const GET_CRYPTO_ASSETS_CACHE_KEY = 'getCryptoAssets'

export const GET_CRYPTO_ASSETS_REVALIDATE_TIME = 14400 // 4h

export const TYPE_BADGE_VARIANT = {
    [TransactionType.Buy]: 'default',
    [TransactionType.Sell]: 'destructive',
    [TransactionType.Reward]: 'secondary',
    [TransactionType.Fee]: 'outline',
} as const

export const TYPE_LABEL = {
    [TransactionType.Buy]: 'Buy',
    [TransactionType.Sell]: 'Sell',
    [TransactionType.Reward]: 'Reward',
    [TransactionType.Fee]: 'Fee',
} as const
