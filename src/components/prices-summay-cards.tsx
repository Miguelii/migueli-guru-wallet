import type { TickerData } from '@/types/Transaction'
import { MetricCard } from './ui/metric-card'
import { formatCurrency } from '@/lib/formaters'
import { PUBLIC_ASSET_BUCKET_PATH } from '@/lib/constants.server'

type Props = {
    data: TickerData[]
}

export function PricesSummaryCards({ data }: Props) {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {data.map((tick, i) => (
                <PricesSummaryCard
                    key={`${tick.ticker}-${tick.currency}_${i}`}
                    title={`${tick.ticker}-${tick.currency}`}
                    tick={tick}
                />
            ))}
        </section>
    )
}

type PricesSummaryCardProps = {
    title: string
    tick: TickerData
}

function PricesSummaryCard({ title, tick }: PricesSummaryCardProps) {
    const currency = tick.currency

    return (
        <MetricCard
            titleColor={tick.hex_color}
            title={title}
            imgSrc={{
                src: `${PUBLIC_ASSET_BUCKET_PATH}/${tick.logo}`,
                alt: `${tick.ticker}-${tick.currency} Logo`,
            }}
        >
            <div>
                <p className="text-2xl font-bold tabular-nums tracking-tight text-primary">
                    {formatCurrency(tick.curr_price, currency)}
                </p>
            </div>
        </MetricCard>
    )
}
