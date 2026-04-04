import type { TickerData } from '@/types/Transaction'
import { formatCurrency } from '@/lib/formaters'
import { PUBLIC_ASSET_BUCKET_PATH } from '@/lib/constants.server'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { getBuildId, groupAssetsByType } from '@/lib/utils'
import { ASSETS_GROUP_ORDER } from '@/lib/constants'

type Props = {
    data: TickerData[]
}

const buildId = getBuildId()

export function PricesSummaryCards({ data }: Props) {
    const groups = groupAssetsByType(data)

    return (
        <Card className="shadow-sm w-full min-w-0">
            <CardHeader className="flex flex-row items-center gap-2">
                <CardTitle>Watchlist</CardTitle>
                <Badge variant="secondary" className="text-xs tabular-nums">
                    {data.length}
                </Badge>
            </CardHeader>
            <CardContent className="grid gap-0 p-0">
                {ASSETS_GROUP_ORDER.map((type) => {
                    const tickers = groups.get(type)
                    if (!tickers) return null

                    return (
                        <div key={type}>
                            <div className="flex items-center gap-2 border-t border-border bg-muted px-6 py-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    {type}
                                </span>
                                <span className="text-[10px] tabular-nums text-muted-foreground/60">
                                    {tickers.length}
                                </span>
                            </div>
                            {tickers.map((tick) => (
                                <div
                                    key={`watchlist-${tick.ticker}`}
                                    className="flex items-center justify-between gap-4 border-t border-border/50 px-6 py-3 transition-colors hover:bg-muted/50 cursor-pointer h-12"
                                >
                                    <div className="flex items-center gap-3">
                                        {tick.logo ? (
                                            <Image
                                                src={`${PUBLIC_ASSET_BUCKET_PATH}${tick.logo}?v=${buildId}`}
                                                alt={`${tick.ticker} logo`}
                                                width={32}
                                                height={32}
                                                className="rounded-full w-8 h-8"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                                                {tick.ticker.slice(0, 2)}
                                            </div>
                                        )}
                                        <span
                                            className="text-sm font-semibold"
                                            style={{ color: tick.hex_color ?? undefined }}
                                        >
                                            {tick.ticker}
                                        </span>
                                    </div>
                                    <span className="text-sm font-bold tabular-nums tracking-tight text-primary">
                                        {formatCurrency(tick.curr_price, tick.currency, 4)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
