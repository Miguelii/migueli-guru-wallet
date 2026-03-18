import { AppSidebar } from '@/components/app-sidebar'
import { RefreshApp } from '@/components/refresh-app'
import { SignOutApp } from '@/components/sign-out-app'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

type Props = LayoutProps<'/portfolio'>

export default async function PortfolioDashboard({ children }: Props) {
    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 54)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset className="min-w-0 overflow-hidden">
                <div className="flex flex-col gap-6 p-4 md:p-6 w-full min-w-0 overflow-hidden">
                    <div className="flex w-full items-center gap-1 justify-center">
                        <SidebarTrigger className="-ml-1 h-8 cursor-pointer" />
                        <Separator orientation="vertical" className="mx-2 h-4 top-4 relative" />
                        <h1 className="text-base font-bold w-full">Portfolio</h1>
                        <div className="flex flex-row gap-3">
                            <RefreshApp />
                            <SignOutApp />
                        </div>
                    </div>
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
