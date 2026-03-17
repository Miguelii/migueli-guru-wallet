import { Ticker, TransactionType } from '@/types/Transaction'

/** @public */
export const NEXT_STATIC_PATH = '/_next/static'

export const NEXT_IMAGE_PATH = '/_next/image'

export const STATIC_PREFIXES = ['/_next', '/api/', '/assets', '/favicon', '/robots.txt', '/script']

export const HOME_PAGE_URL = '/' as const

export const CryptoTickerSet = new Set<Ticker>([Ticker.ETH, Ticker.SOL, Ticker.BTC])

export const ETFTickerSet = new Set<Ticker>([Ticker.VUAA])

export const StockTickerSet = new Set<Ticker>([Ticker.ATCH])

export const PRIVATE_ROUTE_PAGE = '/portfolio'

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
