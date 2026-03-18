import type { HoldingSummary } from '@/types/Holding'
import { formatCurrency, formatPercentage, formatSignedCurrency } from '@/lib/formaters'
import { Wallet, Bitcoin, BarChart3, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MetricCard } from './ui/metric-card'
import { Currency, type CambioRates } from '@/types/Transaction'
import { computePortfolioTotals } from '@/lib/calculations'

type Props = {
    holdings: HoldingSummary[]
    rates: CambioRates
}

const currency = Currency.EUR

export function PortfolioSummaryCards({ holdings, rates }: Props) {
    const cryptoHoldings = holdings.filter((h) => h.tickerType === 'CRYPTO')
    const etfHoldings = holdings.filter((h) => h.tickerType === 'ETF')
    const stockHoldings = holdings.filter((h) => h.tickerType === 'STOCK')

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <PortfolioSummaryCard
                title="Total Net Worth"
                icon={Wallet}
                holdings={holdings}
                rates={rates}
            />
            <PortfolioSummaryCard
                title="Crypto"
                icon={Bitcoin}
                holdings={cryptoHoldings}
                rates={rates}
            />
            <PortfolioSummaryCard
                title="ETFs"
                icon={BarChart3}
                holdings={etfHoldings}
                rates={rates}
            />
            <PortfolioSummaryCard
                title="Stocks"
                icon={TrendingUp}
                holdings={stockHoldings}
                rates={rates}
            />
        </section>
    )
}

type PortfolioSummaryCardProps = {
    title: string
    icon: LucideIcon
    holdings: HoldingSummary[]
    rates: CambioRates
}

function PortfolioSummaryCard({ title, icon: Icon, holdings, rates }: PortfolioSummaryCardProps) {
    const { totalInvested, currentValue, glValue, glPct } = computePortfolioTotals(holdings, rates)
    const isNeutral = glValue == 0
    const isPositive = glValue > 0
    const isNegative = glValue < 0

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
