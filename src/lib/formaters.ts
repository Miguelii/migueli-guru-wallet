const currencyFormatters = new Map<string, Intl.NumberFormat>()

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

export function formatCurrency(value: number, currency: string): string {
    return getCurrencyFormatter(currency).format(value)
}

export function formatQuantity(value: number, decimals = 4): string {
    return value.toLocaleString('pt-PT', {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
    })
}

export function formatPercentage(value: number): string {
    return `${value.toFixed(2)}%`
}

export function formatSignedCurrency(value: number, currency: string): string {
    return `${getCurrencyFormatter(currency).format(value)}`
}

export function formatDate(dateStr: string) {
    const date = new Date(dateStr.replace(' ', 'T'))
    return date.toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}
