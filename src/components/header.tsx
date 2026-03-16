import { WalletIcon } from 'lucide-react'

export function Header() {
    return (
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
            <div className="flex items-center gap-2 h-14 px-4 md:px-6 max-w-screen-2xl mx-auto">
                <WalletIcon className="h-5 w-5 text-chart-1" />
                <span className="text-base font-bold tracking-tight">Migueli Guru Finances</span>
            </div>
        </header>
    )
}
