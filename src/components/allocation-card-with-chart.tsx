import type { HoldingSummary } from '@/types/Holding'
import { AllocationChart } from './allocation-chart'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'

type Props = {
    holdings: HoldingSummary[]
}

export function AllocationCardWithChart({ holdings }: Props) {
    return (
        <Card className="h-92.5 w-full">
            <CardHeader>
                <CardTitle>Allocation</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
                <AllocationChart holdings={holdings} />
            </CardContent>
        </Card>
    )
}
