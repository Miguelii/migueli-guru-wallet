import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            <Skeleton className="w-full h-27.25" />
            <Skeleton className="w-full h-27.25" />
            <Skeleton className="w-full h-27.25" />
            <Skeleton className="w-full h-27.25" />
            <Skeleton className="w-full h-27.25" />
        </section>
    )
}
