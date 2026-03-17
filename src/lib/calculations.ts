import type { Ticker, TickerData, Transaction } from '@/types/Transaction'
import { TransactionType } from '@/types/Transaction'
import type { HoldingSummary } from '@/types/Holding'

/**
 * Groups transactions by ticker_id and computes aggregated holding metrics.
 * Uses weighted average cost (DCA) method.
 */
export function aggregateHoldings(
    transactions: Transaction[],
    tickerData: TickerData[]
): HoldingSummary[] {
    // Build lookup map from TickerData array
    const tickerDataMap = new Map<Ticker, TickerData>(tickerData.map((td) => [td.ticker, td]))

    const grouped = new Map<Ticker, Transaction[]>()

    for (const tx of transactions) {
        const existing = grouped.get(tx.ticker_id)
        if (existing) {
            existing.push(tx)
        } else {
            grouped.set(tx.ticker_id, [tx])
        }
    }

    const holdings: HoldingSummary[] = []

    for (const [tickerId, txs] of grouped) {
        const td = tickerDataMap.get(tickerId)
        const symbol = tickerId as string
        const currency = td?.currency ?? 'EUR'
        const tickerLogo = td?.logo as TickerData['logo']

        let totalQuantity = 0
        let totalInvested = 0
        let totalFees = 0
        let realizedGl = 0
        let realizedCostBasis = 0

        // First pass: process BUY, REWARD, and FEE to build cost basis
        for (const tx of txs) {
            if (tx.type === TransactionType.Buy) {
                totalQuantity += tx.quantity ?? 0
                totalInvested += tx.value ?? 0
            } else if (tx.type === TransactionType.Reward) {
                // Staking rewards: free tokens, only increase quantity
                totalQuantity += tx.quantity ?? 0
            }
            // Fee-only transactions (service charges) and per-tx fees both accumulate
            totalFees += tx.fee
        }

        // Compute avg cost before processing sells
        const avgCost = totalQuantity > 0 ? totalInvested / totalQuantity : 0

        // Second pass: process SELL using weighted average cost
        for (const tx of txs) {
            if (tx.type === TransactionType.Sell) {
                const costOfSold = avgCost * (tx.quantity ?? 0)
                realizedGl += (tx.value ?? 0) - costOfSold
                realizedCostBasis += costOfSold
                totalQuantity -= tx.quantity ?? 0
                totalInvested -= costOfSold
            }
        }

        const currentPrice = td?.curr_price ?? 0
        const currentValue = totalQuantity * currentPrice
        const avgCostPerShare = totalQuantity > 0 ? totalInvested / totalQuantity : avgCost

        // Realized G/L percentage (relative to cost basis of sold shares)
        const realizedGlPct = realizedCostBasis !== 0 ? (realizedGl / realizedCostBasis) * 100 : 0

        // Unrealized G/L (open positions only)
        const unrealizedGl = currentValue - totalInvested
        const unrealizedGlPct = totalInvested !== 0 ? (unrealizedGl / totalInvested) * 100 : 0

        const costBasis = totalInvested + totalFees
        const unrealizedGlWithFees = currentValue - costBasis
        const unrealizedGlWithFeesPct =
            costBasis !== 0 ? (unrealizedGlWithFees / costBasis) * 100 : 0

        // Total G/L = realized + unrealized
        const totalGl = realizedGl + unrealizedGl
        const totalCostBasis = totalInvested + realizedCostBasis
        const totalGlPct = totalCostBasis !== 0 ? (totalGl / totalCostBasis) * 100 : 0

        const totalGlWithFees = totalGl - totalFees
        const totalCostBasisWithFees = totalCostBasis + totalFees
        const totalGlWithFeesPct =
            totalCostBasisWithFees !== 0 ? (totalGlWithFees / totalCostBasisWithFees) * 100 : 0

        holdings.push({
            ticker_id: tickerId,
            symbol,
            tickerLogo,
            currency,
            total_quantity: totalQuantity,
            total_invested: totalInvested,
            total_fees: totalFees,
            current_price: currentPrice,
            current_value: currentValue,
            avg_cost_per_share: avgCostPerShare,
            realized_gl: realizedGl,
            realized_gl_pct: realizedGlPct,
            unrealized_gl: unrealizedGl,
            unrealized_gl_pct: unrealizedGlPct,
            unrealized_gl_with_fees: unrealizedGlWithFees,
            unrealized_gl_with_fees_pct: unrealizedGlWithFeesPct,
            total_gl: totalGl,
            total_gl_pct: totalGlPct,
            total_gl_with_fees: totalGlWithFees,
            total_gl_with_fees_pct: totalGlWithFeesPct,
        })
    }

    return holdings
}
