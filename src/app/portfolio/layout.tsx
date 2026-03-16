import { Header } from '@/components/header'

type Props = LayoutProps<'/portfolio'>

export default function PortfolioDashboard({ children }: Props) {
    return (
        <>
            <Header />
            {children}
        </>
    )
}
