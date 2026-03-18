import type { HoldingSummary } from '@/types/Holding'
import { formatCurrency, formatPercentage, formatSignedCurrency } from '@/lib/formaters'
import { Wallet, Bitcoin, BarChart3, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MetricCard } from './metric-card'

type Props = {
    holdings: HoldingSummary[]
}

export function PortfolioSummaryCards({ holdings }: Props) {
    const cryptoHoldings = holdings.filter((h) => h.tickerType === 'CRYPTO')
    const etfHoldings = holdings.filter((h) => h.tickerType === 'ETF')
    const stockHoldings = holdings.filter((h) => h.tickerType === 'STOCK')

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <PortfolioSummaryCard title="Total Net Worth" icon={Wallet} holdings={holdings} />
            <PortfolioSummaryCard title="Crypto" icon={Bitcoin} holdings={cryptoHoldings} />
            <PortfolioSummaryCard title="ETFs" icon={BarChart3} holdings={etfHoldings} />
            <PortfolioSummaryCard title="Stocks" icon={TrendingUp} holdings={stockHoldings} />
        </section>
    )
}

type PortfolioSummaryCardProps = {
    title: string
    icon: LucideIcon
    holdings: HoldingSummary[]
}

function PortfolioSummaryCard({ title, icon: Icon, holdings }: PortfolioSummaryCardProps) {
    const totalInvested = holdings.reduce((sum, h) => sum + h.total_invested, 0)
    const currentValue = holdings.reduce((sum, h) => sum + h.current_value, 0)
    const glValue = currentValue - totalInvested
    const glPct = totalInvested !== 0 ? (glValue / totalInvested) * 100 : 0
    const isNeutral = glValue == 0
    const isPositive = glValue > 0
    const isNegative = glValue < 0

    const currency = 'EUR'

    return (
        <MetricCard title={title} icon={Icon}>
            <div>
                <p className="text-2xl font-bold tabular-nums tracking-tight">
                    {formatCurrency(currentValue, currency)}
                </p>
            </div>
            <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                    Invested {formatCurrency(totalInvested, currency)}
                </p>
                <div
                    className={cn('flex items-center gap-0.5 text-xs font-medium', {
                        'text-muted-foreground': isNeutral,
                        'text-success': isPositive,
                        'text-destructive': isNegative,
                    })}
                >
                    <span className="tabular-nums">
                        {formatSignedCurrency(glValue, currency)} · {formatPercentage(glPct)}
                    </span>
                </div>
            </div>
        </MetricCard>
    )
}
