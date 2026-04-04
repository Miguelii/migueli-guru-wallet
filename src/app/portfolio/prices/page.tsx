import { PricesSummaryCards } from '@/components/prices-summay-cards'
import { getLatestUpdate } from '@/lib/utils'
import { getAssets } from '@/services/get-assets'
import type { Metadata } from 'next/types'

export const metadata: Metadata = {
    title: 'Watchlist | Migueli Guru Finances',
}

export default async function PortfolioPage() {
    const data = await getAssets()

    return (
        <main className="flex flex-col gap-6 mb-24" id="#main">
            <span className="text-xs text-muted-foreground">
                Last Update: {getLatestUpdate(data)}
            </span>
            <PricesSummaryCards data={data} />
        </main>
    )
}
