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
import { TransactionType } from '@/types/Transaction'
import { formatCurrency, formatDate, formatQuantity } from '@/lib/formaters'
import { ArrowLeftRight } from 'lucide-react'

type Props = {
    transactions: Transaction[]
    tickerData: TickerData[]
}

const TYPE_BADGE_VARIANT = {
    [TransactionType.Buy]: 'default',
    [TransactionType.Sell]: 'destructive',
    [TransactionType.Reward]: 'secondary',
    [TransactionType.Fee]: 'outline',
} as const

const TYPE_LABEL = {
    [TransactionType.Buy]: 'Buy',
    [TransactionType.Sell]: 'Sell',
    [TransactionType.Reward]: 'Reward',
    [TransactionType.Fee]: 'Fee',
} as const

export function TransactionsCard({ transactions, tickerData }: Props) {
    const currencyMap = new Map<Ticker, string>(tickerData.map((td) => [td.ticker, td.currency]))

    const sorted = [...transactions].sort(
        (a, b) =>
            new Date(b.buy_date.replace(' ', 'T')).getTime() -
            new Date(a.buy_date.replace(' ', 'T')).getTime()
    )

    return (
        <Card className="flex w-full flex-col h-92.5 shadow-sm">
            <CardHeader className="shrink-0 flex flex-row items-center gap-2">
                <ArrowLeftRight className="h-5 w-5 text-muted-foreground" />
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
                        {sorted.map((tx) => {
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
