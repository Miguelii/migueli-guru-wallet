import { PricesSummaryCards } from '@/components/prices-summay-cards'
import { getAssets } from '@/services/get-assets'

export default async function PortfolioPage() {
    const data = await getAssets()

    return (
        <main className="flex flex-col gap-6 mb-24" id="#main">
            <PricesSummaryCards data={data} />
        </main>
    )
}
