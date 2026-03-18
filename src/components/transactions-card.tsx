'use client'

import { useCallback, useRef, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
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
import {
    Currency,
    TransactionType,
    type Ticker,
    type TickerData,
    type Transaction,
} from '@/types/Transaction'
import { formatCurrency, formatDate, formatQuantity } from '@/lib/formaters'
import { TYPE_BADGE_VARIANT, TYPE_LABEL } from '@/lib/constants'

type Props = {
    /** List of transactions to display */
    transactions: Transaction[]
    /** Ticker metadata for currency lookup */
    tickerData: TickerData[]
}

/**
 * Virtualized transaction table using @tanstack/react-virtual.
 * @param props - Transactions and ticker data
 */
export function TransactionsCard({ transactions, tickerData }: Props) {
    const currencyMap = new Map<Ticker, string>(tickerData.map((td) => [td.ticker, td.currency]))
    const parentRef = useRef<HTMLDivElement>(null)

    const virtualizer = useVirtualizer({
        count: transactions.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 40,
        overscan: 5,
    })

    return (
        <Card className="flex w-full lg:w-[60%]! flex-col h-92.5 shadow-sm">
            <CardHeader className="shrink-0 flex flex-row items-center gap-2">
                <CardTitle>Transactions</CardTitle>
            </CardHeader>
            <CardContent ref={parentRef} className="min-h-0 flex-1 overflow-y-auto">
                <Table>
                    <TableHeader className="sticky top-0 z-10 bg-card">
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
                    <TableBody
                        style={{
                            height: `${virtualizer.getTotalSize()}px`,
                            position: 'relative',
                        }}
                    >
                        {virtualizer.getVirtualItems().map((virtualRow) => {
                            const tx = transactions[virtualRow.index]
                            const currency = currencyMap.get(tx.ticker_id) ?? Currency.EUR
                            return (
                                <TableRow
                                    key={tx.id}
                                    className="cursor-pointer hover:bg-muted/50 transition-colors absolute w-full flex"
                                    style={{
                                        height: `${virtualRow.size}px`,
                                        transform: `translateY(${virtualRow.start}px)`,
                                    }}
                                >
                                    <TableCell className="text-muted-foreground flex-1">
                                        {formatDate(tx.buy_date)}
                                    </TableCell>
                                    <TableCell className="font-medium flex-1">
                                        {tx.ticker_id}
                                    </TableCell>
                                    <TableCell className="flex-1">
                                        <Badge variant={TYPE_BADGE_VARIANT[tx.type]}>
                                            {TYPE_LABEL[tx.type]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums flex-1">
                                        {tx.quantity != null && tx.type !== TransactionType.Fee
                                            ? formatQuantity(tx.quantity)
                                            : '—'}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums flex-1">
                                        {tx.buy_price != null
                                            ? formatCurrency(tx.buy_price, currency)
                                            : '—'}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums flex-1">
                                        {tx.value != null
                                            ? formatCurrency(tx.value, currency)
                                            : '—'}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums text-muted-foreground flex-1">
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
