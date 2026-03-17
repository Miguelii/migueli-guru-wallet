/** Cache of `Intl.NumberFormat` instances keyed by currency code. */
const currencyFormatters = new Map<string, Intl.NumberFormat>()

/**
 * Returns a cached `Intl.NumberFormat` for the given currency (pt-PT locale, 2 decimal places).
 * Creates and caches a new formatter on first access.
 * @param currency - ISO 4217 currency code (e.g. `'EUR'`, `'USD'`).
 */
function getCurrencyFormatter(currency: string): Intl.NumberFormat {
    const cached = currencyFormatters.get(currency)
    if (cached) return cached

    const formatter = new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
    currencyFormatters.set(currency, formatter)
    return formatter
}

/**
 * Formats a number as currency (e.g. `1 234,56 €`).
 * @param value - The numeric value to format.
 * @param currency - ISO 4217 currency code (e.g. `'EUR'`, `'USD'`).
 */
export function formatCurrency(value: number, currency: string): string {
    return getCurrencyFormatter(currency).format(value)
}

/**
 * Formats a quantity with pt-PT locale and configurable decimal places.
 * @param value - The numeric value to format.
 * @param decimals - Maximum number of decimal places (defaults to `4`).
 */
export function formatQuantity(value: number, decimals = 4): string {
    return value.toLocaleString('pt-PT', {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
    })
}

/**
 * Formats a number as a percentage string with 2 decimal places (e.g. `12.34%`).
 * @param value - The percentage value to format.
 */
export function formatPercentage(value: number): string {
    return `${value.toFixed(2)}%`
}

/**
 * Formats a number as a signed currency string (e.g. `-1 234,56 €`).
 * @param value - The numeric value to format (sign is preserved).
 * @param currency - ISO 4217 currency code (e.g. `'EUR'`, `'USD'`).
 */
export function formatSignedCurrency(value: number, currency: string): string {
    return `${getCurrencyFormatter(currency).format(value)}`
}

/**
 * Parses a date string and formats it as `dd MMM yyyy` in pt-PT locale (e.g. `17 mar. 2026`).
 * @param dateStr - Date string to parse (spaces are replaced with `T` for ISO compatibility).
 */
export function formatDate(dateStr: string) {
    const date = new Date(dateStr.replace(' ', 'T'))
    return date.toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}
