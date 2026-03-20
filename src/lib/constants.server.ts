import 'server-only'

import { ServerEnv } from '@/env/server'
import { Data } from 'effect'

export const PUBLIC_ASSET_BUCKET_PATH = `${ServerEnv.NEXT_SUPABASE_URL}/storage/v1/object/public/public_assets`

export const NEXT_IMAGE_PATH = '/_next/image'

export const SW_PATH = '/sw.js'

export const STATIC_PREFIXES = [
    '/_next',
    '/api/',
    '/assets',
    '/favicon',
    '/robots.txt',
    '/script',
    '/sw.js',
    '/apple-touch-icon',
    '/web-app-manifest-192x192',
    '/web-app-manifest-512x512',
]

export const GET_ASSETS_CACHE_KEY = 'getAssets'

export const GET_DATA_REVALIDATE_TIME = 14400 // 4h

export const GET_ALL_TRANSACTIONS_CACHE_KEY = 'getAllTransactions'

export const GET_ALL_TRANSACTIONS_REVALIDATE_TIME = 14400 // 4h

const tagged = <T extends string>(tag: T) =>
    Data.TaggedError(tag)<{ cause: unknown; message?: string }>

export class CreateSbClientError extends tagged('CreateSbClientError') {}
export class SbQueryError extends tagged('SbQueryError') {}
export class IsBotError extends tagged('IsBotError') {}
export class SignInWithPasswordError extends tagged('SignInWithPasswordError') {}
export class SignOutError extends tagged('SignOutError') {}
export class GetCoinbasePriceError extends tagged('GetCoinbasePriceError') {}
export class GetFinancePriceError extends tagged('GetFinancePriceError') {}
