import { getAllTransactions } from '@/services/get-all-transactions'
import { aggregateHoldings } from '@/lib/calculations'
import { TransactionsCard } from '@/components/transactions-card'
import { getAssets } from '@/services/get-assets'
import { CurrentPricesBadges } from '@/components/current-prices-badges'
import { AllocationCardWithChart } from '@/components/allocation-card-with-chart'
import { HoldingsCard } from '@/components/holdings-card'
import type { Metadata } from 'next'
import { PortfolioSummaryCards } from '@/components/portfolio-summary-cards'
import { Ticker, type CambioRates } from '@/types/Transaction'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
    title: 'Portfolio | Migueli Guru Finances',
}

export default async function PortfolioPage() {
    const [transactions, data, cookieStore] = await Promise.all([
        getAllTransactions(),
        getAssets(),
        cookies(),
    ])

    const hidePricesCookie = cookieStore.get('hide_prices')
    const hidePrices = hidePricesCookie?.value == null ? false : hidePricesCookie.value !== 'false'

    const holdings = aggregateHoldings(transactions, data)

    const rates: CambioRates = {
        usdToEur: data.find((item) => item.ticker === Ticker.USD_EUR)?.curr_price ?? 1,
    }

    return (
        <main className="flex flex-col gap-6 mb-24 min-w-0" id="#main">
            <CurrentPricesBadges data={data} />

            <PortfolioSummaryCards holdings={holdings} rates={rates} hidePrices={hidePrices} />

            <section className="flex flex-col lg:flex-row gap-6">
                <TransactionsCard
                    transactions={transactions}
                    tickerData={data}
                    hidePrices={hidePrices}
                />
                <AllocationCardWithChart
                    holdings={holdings}
                    rates={rates}
                    hidePrices={hidePrices}
                />
            </section>

            <HoldingsCard holdings={holdings} hidePrices={hidePrices} />
        </main>
    )
}
