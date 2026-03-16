import type { HoldingSummary } from '@/types/Holding'
import { CryptoTickerSet, ETFTickerSet, StockTickerSet } from '@/lib/constants'
import { formatCurrency, formatPercentage, formatSignedCurrency } from '@/lib/formaters'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Wallet, Bitcoin, BarChart3, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Props = {
    holdings: HoldingSummary[]
}

export function SummaryCards({ holdings }: Props) {
    const cryptoHoldings = holdings.filter((h) => CryptoTickerSet.has(h.ticker_id))
    const etfHoldings = holdings.filter((h) => ETFTickerSet.has(h.ticker_id))
    const stockHoldings = holdings.filter((h) => StockTickerSet.has(h.ticker_id))

    return (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <PortfolioSummaryCard title="Portfolio" icon={Wallet} holdings={holdings} />
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
    const isPositive = glValue >= 0

    const currency = 'EUR'

    return (
        <Card className="cursor-pointer hover:shadow-md hover:border-border/80 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-2">
                <div>
                    <p className="text-2xl font-bold tabular-nums tracking-tight">
                        {formatCurrency(currentValue, currency)}
                    </p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                        Invested {formatCurrency(totalInvested, currency)}
                    </p>
                    <div className={`flex items-center gap-0.5 text-xs font-medium ${isPositive ? 'text-success' : 'text-destructive'}`}>
                        <span className="tabular-nums">
                            {formatSignedCurrency(glValue, currency)} · {formatPercentage(glPct)}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
