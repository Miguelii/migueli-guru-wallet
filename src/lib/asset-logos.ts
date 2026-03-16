/**
 * Maps asset symbols to their logo URLs.
 * Uses cryptocurrency-icons CDN for crypto and custom URLs for stocks/ETFs.
 */
const ASSET_LOGOS: Record<string, string> = {
    BTC: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    ETH: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    SOL: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    ATCH: 'https://s3-symbol-logo.tradingview.com/africa-tech-media--big.svg',
    VUAA: 'https://www.vanguard.co.uk/content/dam/intl/europe/documents/en/Vanguard-logo-green.svg',
}

const FALLBACK_LOGO = 'https://via.placeholder.com/24x24?text=%3F'

export function getAssetLogo(symbol: string): string {
    return ASSET_LOGOS[symbol] ?? FALLBACK_LOGO
}
