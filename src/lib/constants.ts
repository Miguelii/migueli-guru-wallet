import { Ticker } from '@/types/Transaction'

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
