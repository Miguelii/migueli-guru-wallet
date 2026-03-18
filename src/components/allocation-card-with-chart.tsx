import type { HoldingSummary } from '@/types/Holding'
import { AllocationChart } from '@/components/allocation-chart'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { CambioRates } from '@/types/Transaction'

type Props = {
    holdings: HoldingSummary[]
    rates: CambioRates
}

export function AllocationCardWithChart({ holdings, rates }: Props) {
    return (
        <Card className="h-92.5 w-full lg:w-[40%]! shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2">
                <CardTitle>Allocation</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
                <AllocationChart holdings={holdings} rates={rates} />
            </CardContent>
        </Card>
    )
}
