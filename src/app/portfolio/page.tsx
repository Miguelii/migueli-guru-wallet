import { getAllTransactions } from '@/services/get-all-transactions'
import { aggregateHoldings } from '@/lib/calculations'
import { TransactionsCard } from '@/components/transactions-card'
import { getAssets } from '@/services/get-assets'
import { CurrentPricesBadges } from '@/components/current-prices-badges'
import { AllocationCardWithChart } from '@/components/allocation-card-with-chart'
import { HoldingsCard } from '@/components/holdings-card'
import type { Metadata } from 'next'
import { PortfolioSummaryCards } from '@/components/portfolio-summary-cards'

export const metadata: Metadata = {
    title: 'Portfolio | Migueli Guru Finances',
}

export default async function PortfolioPage() {
    const [transactions, data] = await Promise.all([getAllTransactions(), getAssets()])

    const holdings = aggregateHoldings(transactions, data)

    return (
        <main className="flex flex-col gap-6 mb-24" id="#main">
            <CurrentPricesBadges data={data} />

            <PortfolioSummaryCards holdings={holdings} />

            <section className="flex flex-col lg:flex-row gap-6">
                <TransactionsCard transactions={transactions} tickerData={data} />
                <AllocationCardWithChart holdings={holdings} />
            </section>

            <HoldingsCard holdings={holdings} />
        </main>
    )
}
