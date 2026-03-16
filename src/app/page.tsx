import { getCryptoAssets } from '@/services/get-crypto-assets'
import { aggregateHoldings } from '@/lib/calculations'
import { TransactionsCard } from '@/components/transactions-card'
import { getData } from '@/services/get-data'
import { CurrentPricesBadges } from '@/components/current-prices-badges'
import { SummaryCards } from '@/components/summary-cards'
import { AllocationCardWithChart } from '@/components/allocation-card-with-chart'
import { HoldingsCard } from '@/components/holdings-card'

export default function DashboardPage() {
    const transactions = getCryptoAssets()
    const data = getData()
    const holdings = aggregateHoldings(transactions, data)

    return (
        <div className="space-y-6">
            <CurrentPricesBadges data={data} />

            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
            </div>

            <SummaryCards holdings={holdings} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <TransactionsCard transactions={transactions} tickerData={data} />
                </div>
                <AllocationCardWithChart holdings={holdings} />
            </div>

            <HoldingsCard holdings={holdings} />
        </div>
    )
}
