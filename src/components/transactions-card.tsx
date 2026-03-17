import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { Ticker, TickerData, Transaction } from '@/types/Transaction'
import { formatCurrency, formatDate, formatQuantity } from '@/lib/formaters'
import { TYPE_BADGE_VARIANT, TYPE_LABEL } from '@/lib/constants'

type Props = {
    transactions: Transaction[]
    tickerData: TickerData[]
}

export function TransactionsCard({ transactions, tickerData }: Props) {
    const currencyMap = new Map<Ticker, string>(tickerData.map((td) => [td.ticker, td.currency]))

    return (
        <Card className="flex w-full lg:w-[60%]! flex-col h-92.5 shadow-sm">
            <CardHeader className="shrink-0 flex flex-row items-center gap-2">
                <CardTitle>Transactions</CardTitle>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Asset</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Quantity</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Value</TableHead>
                            <TableHead className="text-right">Fee</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((tx) => {
                            const currency = currencyMap.get(tx.ticker_id) ?? 'EUR'
                            return (
                                <TableRow
                                    key={tx.id}
                                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                                >
                                    <TableCell className="text-muted-foreground">
                                        {formatDate(tx.buy_date)}
                                    </TableCell>
                                    <TableCell className="font-medium">{tx.ticker_id}</TableCell>
                                    <TableCell>
                                        <Badge variant={TYPE_BADGE_VARIANT[tx.type]}>
                                            {TYPE_LABEL[tx.type]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums">
                                        {tx.quantity != null ? formatQuantity(tx.quantity) : '—'}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums">
                                        {tx.buy_price != null
                                            ? formatCurrency(tx.buy_price, currency)
                                            : '—'}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums">
                                        {tx.value != null
                                            ? formatCurrency(tx.value, currency)
                                            : '—'}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums text-muted-foreground">
                                        {formatCurrency(tx.fee, currency)}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
