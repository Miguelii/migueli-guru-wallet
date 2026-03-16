import type { HoldingSummary } from '@/types/Holding'
import { CryptoTickerSet, ETFTickerSet, StockTickerSet } from '@/lib/constants'
import { formatCurrency } from '@/lib/formaters'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

type Props = {
    holdings: HoldingSummary[]
}

export function SummaryCards({ holdings }: Props) {
    const cryptoHoldings = holdings.filter((h) => CryptoTickerSet.has(h.ticker_id))
    const etfHoldings = holdings.filter((h) => ETFTickerSet.has(h.ticker_id))
    const stockHoldings = holdings.filter((h) => StockTickerSet.has(h.ticker_id))

    return (
        <div className="flex flex-row gap-6">
            <PortfolioSummaryCard title="Portfolio Value" holdings={holdings} />
            <PortfolioSummaryCard title="Crypto" holdings={cryptoHoldings} />
            <PortfolioSummaryCard title="ETFs" holdings={etfHoldings} />
            <PortfolioSummaryCard title="Stocks" holdings={stockHoldings} />
        </div>
    )
}

type PortfolioSummaryCardProps = {
    title: string
    holdings: HoldingSummary[]
}

export function PortfolioSummaryCard({ title, holdings }: PortfolioSummaryCardProps) {
    const totalInvested = holdings.reduce((sum, h) => sum + h.total_invested, 0)
    const currentValue = holdings.reduce((sum, h) => sum + h.current_value, 0)

    const currency = 'EUR'

    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle className="text-sm font-bold text-primary">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
                <div>
                    <p className="text-xs text-muted-foreground">Total Invested</p>
                    <p className="text-lg font-semibold tabular-nums">
                        {formatCurrency(totalInvested, currency)}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground">Market Value</p>
                    <p
                        className={`text-lg font-semibold tabular-nums ${currentValue >= totalInvested ? 'text-success' : 'text-destructive'}`}
                    >
                        {formatCurrency(currentValue, currency)}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
