'use client'

import * as React from 'react'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'
import { CircleDollarSignIcon, LayoutDashboardIcon, type LucideProps } from 'lucide-react'
import Image from 'next/image'
import { getBuildId } from '@/lib/utils'
import { PRICES_ROUTE_PATH, PRIVATE_ROUTE_PATH } from '@/lib/constants'
import Link from 'next/link'

type NavIcon = React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
>

type NavMain = {
    title: string
    url: string
    Icon: NavIcon
}

const data: { navMain: NavMain[] } = {
    navMain: [
        {
            title: 'Portfolio',
            url: PRIVATE_ROUTE_PATH,
            Icon: LayoutDashboardIcon,
        },
        {
            title: 'Prices',
            url: PRICES_ROUTE_PATH,
            Icon: CircleDollarSignIcon,
        },
    ],
}

const buildId = getBuildId()

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton className="data-[slot=sidebar-menu-button]:p-1.5! h-full">
                            <div className="flex items-center gap-2.5 h-full w-full">
                                <Image
                                    src={`/assets/logo.webp?v=${buildId}`}
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                    alt="Migueli Guru Finances Logo"
                                    unoptimized
                                />
                                <span className="text-base font-bold tracking-tight flex-wrap">
                                    Migueli Finances
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter className="p-3">
                <Image
                    src={`/assets/funny.webp?v=${buildId}`}
                    width={280}
                    height={200}
                    className="w-full rounded-lg"
                    alt="Vais ser pobre para sempre"
                    unoptimized
                />
            </SidebarFooter>
        </Sidebar>
    )
}

function NavMain({ items }: { items: NavMain[] }) {
    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    {items?.map((item) => {
                        const Icon = item.Icon
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton tooltip={item.title} className="cursor-pointer!">
                                    <Link className="contents" prefetch={false} href={item.url}>
                                        {Icon && <Icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
