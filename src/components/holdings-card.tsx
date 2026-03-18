import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    formatCurrency,
    formatQuantity,
    formatPercentage,
    formatSignedCurrency,
} from '@/lib/formaters'
import Image from 'next/image'
import type { HoldingSummary } from '@/types/Holding'
import { cn, getBuildId } from '@/lib/utils'
import { PUBLIC_ASSET_BUCKET_PATH } from '@/lib/constants.server'

type Props = {
    holdings: HoldingSummary[]
}

const buildId = getBuildId()

export function HoldingsCard({ holdings }: Props) {
    return (
        <Card className="shadow-sm w-full min-w-0">
            <CardHeader className="flex flex-row items-center gap-2">
                <CardTitle>Positions</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Asset</TableHead>
                            <TableHead className="text-right">Quantity</TableHead>
                            <TableHead className="text-right">Total Invested</TableHead>
                            <TableHead className="text-right">Total Fees</TableHead>
                            <TableHead className="text-right">Market Value</TableHead>
                            <TableHead className="text-right">AC/Share</TableHead>
                            <TableHead className="text-right">R G/L</TableHead>
                            <TableHead className="text-right">R G/L %</TableHead>
                            <TableHead className="text-right">UNR G/L</TableHead>
                            <TableHead className="text-right">UNR G/L %</TableHead>
                            <TableHead className="text-right">UNR G/L (w/ fees)</TableHead>
                            <TableHead className="text-right">UNR G/L % (w/ fees)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {holdings.map((h) => (
                            <TableRow
                                key={h.ticker_id}
                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                            >
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src={`${PUBLIC_ASSET_BUCKET_PATH}/${h.tickerLogo}?v=${buildId}`}
                                            alt={h.symbol}
                                            width={24}
                                            height={24}
                                            className="rounded-full"
                                            unoptimized
                                        />
                                        <div>
                                            <div className="font-semibold">{h.symbol}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {h.currency}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right tabular-nums">
                                    {formatQuantity(h.total_quantity)}
                                </TableCell>
                                <TableCell className="text-right tabular-nums">
                                    {formatCurrency(h.total_invested, h.currency)}
                                </TableCell>
                                <TableCell className="text-right tabular-nums">
                                    {formatCurrency(h.total_fees, h.currency)}
                                </TableCell>
                                <TableCell className="text-right tabular-nums">
                                    {formatCurrency(h.current_value, h.currency)}
                                </TableCell>
                                <TableCell className="text-right tabular-nums">
                                    {formatCurrency(h.avg_cost_per_share, h.currency)}
                                </TableCell>
                                <TableCell
                                    className={cn('text-right tabular-nums', {
                                        'text-success': h.realized_gl > 0,
                                        'text-destructive': h.realized_gl < 0,
                                        'text-muted-foreground': h.realized_gl == 0,
                                    })}
                                >
                                    {formatSignedCurrency(h.realized_gl, h.currency)}
                                </TableCell>
                                <TableCell
                                    className={cn('text-right tabular-nums', {
                                        'text-success': h.realized_gl_pct > 0,
                                        'text-destructive': h.realized_gl_pct < 0,
                                        'text-muted-foreground': h.realized_gl_pct == 0,
                                    })}
                                >
                                    {formatPercentage(h.realized_gl_pct)}
                                </TableCell>
                                <TableCell
                                    className={cn('text-right tabular-nums', {
                                        'text-success': h.total_gl > 0,
                                        'text-destructive': h.total_gl < 0,
                                        'text-muted-foreground': h.total_gl == 0,
                                    })}
                                >
                                    {formatSignedCurrency(h.total_gl, h.currency)}
                                </TableCell>
                                <TableCell
                                    className={cn('text-right tabular-nums', {
                                        'text-success': h.total_gl_pct > 0,
                                        'text-destructive': h.total_gl_pct < 0,
                                        'text-muted-foreground': h.total_gl_pct == 0,
                                    })}
                                >
                                    {formatPercentage(h.total_gl_pct)}
                                </TableCell>
                                <TableCell
                                    className={cn('text-right tabular-nums', {
                                        'text-success': h.total_gl_with_fees > 0,
                                        'text-destructive': h.total_gl_with_fees < 0,
                                        'text-muted-foreground': h.total_gl_with_fees == 0,
                                    })}
                                >
                                    {formatSignedCurrency(h.total_gl_with_fees, h.currency)}
                                </TableCell>
                                <TableCell
                                    className={cn('text-right tabular-nums', {
                                        'text-success': h.total_gl_with_fees_pct > 0,
                                        'text-destructive': h.total_gl_with_fees_pct < 0,
                                        'text-muted-foreground': h.total_gl_with_fees_pct == 0,
                                    })}
                                >
                                    {formatPercentage(h.total_gl_with_fees_pct)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
