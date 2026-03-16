'use client'

import { Pie, PieChart, Cell } from 'recharts'
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart'
import type { HoldingSummary } from '@/types/Holding'
import { formatPercentage } from '@/lib/formaters'

const COLORS = [
    'var(--color-chart-1)',
    'var(--color-chart-2)',
    'var(--color-chart-3)',
    'var(--color-chart-4)',
    'var(--color-chart-5)',
]

type Props = {
    holdings: HoldingSummary[]
}

function renderCustomLabel({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    name,
    percentage,
}: {
    cx: number
    cy: number
    midAngle: number
    innerRadius: number
    outerRadius: number
    name: string
    percentage: number
}) {
    const RADIAN = Math.PI / 180
    const radius = outerRadius + 20
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
        <text
            x={x}
            y={y}
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            className="fill-foreground text-xs"
        >
            <tspan className="font-semibold">{name}</tspan>
            <tspan className="fill-muted-foreground"> {percentage.toFixed(1)}%</tspan>
        </text>
    )
}

export function AllocationChart({ holdings }: Props) {
    const totalValue = holdings.reduce((sum, h) => sum + h.current_value, 0)

    const data = holdings.map((h, i) => ({
        name: h.symbol,
        value: h.current_value,
        percentage: totalValue > 0 ? (h.current_value / totalValue) * 100 : 0,
        currency: h.currency,
        fill: COLORS[i % COLORS.length],
    }))

    const chartConfig = Object.fromEntries(
        holdings.map((h, i) => [
            h.symbol,
            {
                label: h.symbol,
                color: COLORS[i % COLORS.length],
            },
        ])
    ) satisfies ChartConfig

    return (
        <ChartContainer config={chartConfig} className="aspect-square max-h-75 w-full">
            <PieChart>
                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            formatter={(value, name, item) => (
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-muted-foreground">{name}</span>
                                    <span className="font-mono font-medium tabular-nums">
                                        {formatPercentage(item.payload.percentage).replace('+', '')}
                                    </span>
                                </div>
                            )}
                            hideLabel
                        />
                    }
                />
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="55%"
                    outerRadius="75%"
                    strokeWidth={2}
                    stroke="var(--color-background)"
                    label={renderCustomLabel}
                    labelLine={false}
                >
                    {data.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                    ))}
                </Pie>
            </PieChart>
        </ChartContainer>
    )
}
