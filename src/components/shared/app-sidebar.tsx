"use client"

import * as React from "react"
import {
    Briefcase,
    ChevronRight,
    ChevronsUpDown,
    CreditCard,
    LayoutDashboard,
    LogOut,
    PieChart,
    PlusCircle,
    Settings,
    Tags,
    TrendingDown,
    TrendingUp,
    User as UserIcon,
    Users,
    Wallet,
} from "lucide-react"
import Link from "next/link"
import NextImage from "next/image"
import { usePathname } from "next/navigation"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface NavItem {
    title: string
    url: string
    icon?: React.ElementType
    items?: {
        title: string
        url: string
        icon?: React.ElementType
    }[]
}

// Menu Items Configuration
const navItems: { group: string; items: NavItem[] }[] = [
    {
        group: "Overview",
        items: [
            { title: "Dashboard", url: "/", icon: LayoutDashboard },
            { title: "Analytics & Reports", url: "/reports", icon: PieChart },
        ],
    },
    {
        group: "Finance",
        items: [
            {
                title: "Incomes",
                url: "/incomes",
                icon: TrendingUp,
                items: [
                    { title: "All Incomes", url: "/incomes" },
                    { title: "Add Income", url: "/incomes/new", icon: PlusCircle },
                ],
            },
            {
                title: "Expenses",
                url: "/expenses",
                icon: TrendingDown,
                items: [
                    { title: "All Expenses", url: "/expenses" },
                    { title: "Add Expense", url: "/expenses/new", icon: PlusCircle },
                ],
            },
        ],
    },
    {
        group: "Management",
        items: [
            { title: "Projects", url: "/admin/projects", icon: Briefcase },
            { title: "People", url: "/admin/people", icon: Users },
            { title: "Categories", url: "/admin/categories", icon: Tags },
        ],
    },
]

export function AppSidebar({ userRole = "USER", user, ...props }: React.ComponentProps<typeof Sidebar> & { userRole?: string; user?: any }) {
    const pathname = usePathname()
    const { state, isMobile, setOpenMobile } = useSidebar()

    // Filter navItems based on role
    const filteredNavItems = navItems.filter(group => {
        if (group.group === "Management") {
            return userRole.toUpperCase() === "ADMIN"
        }
        return true
    })

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" onClick={() => isMobile && setOpenMobile(false)}>
                                <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-white p-0.5 overflow-hidden">
                                    <NextImage
                                        src="/spendee_logo.png"
                                        alt="Spendee Logo"
                                        width={40}
                                        height={40}
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                                <div className="p-1 grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">Spendee</span>
                                    <span className="truncate text-xs">Expense Manager</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {filteredNavItems.map((group) => (
                    <SidebarGroup key={group.group}>
                        <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
                        <SidebarMenu>
                            {group.items.map((item) => {
                                const isActive = item.url === "/"
                                    ? pathname === "/"
                                    : pathname.startsWith(item.url)

                                // Render Collapsible for items with sub-items
                                if (item.items && item.items.length > 0) {
                                    if (state === "collapsed") {
                                        return (
                                            <SidebarMenuItem key={item.title}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <SidebarMenuButton
                                                            tooltip={item.title}
                                                            isActive={isActive}
                                                            className="hover:bg-primary/10 hover:text-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary transition-all duration-200 ease-in-out"
                                                        >
                                                            {item.icon && <item.icon />}
                                                            <span>{item.title}</span>
                                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                        </SidebarMenuButton>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent side="right" align="start" sideOffset={4}>
                                                        <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        {item.items.map((subItem) => (
                                                            <DropdownMenuItem key={subItem.title} asChild>
                                                                <Link href={subItem.url} className="w-full cursor-pointer" onClick={() => isMobile && setOpenMobile(false)}>
                                                                    <span>{subItem.title}</span>
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </SidebarMenuItem>
                                        )
                                    }

                                    return (
                                        <Collapsible
                                            key={item.title}
                                            asChild
                                            defaultOpen={isActive}
                                            className="group/collapsible"
                                        >
                                            <SidebarMenuItem>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton
                                                        tooltip={item.title}
                                                        isActive={isActive}
                                                        className="hover:bg-primary/10 hover:text-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary transition-all duration-200 ease-in-out"
                                                        suppressHydrationWarning
                                                    >
                                                        {item.icon && <item.icon />}
                                                        <span>{item.title}</span>
                                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent suppressHydrationWarning>
                                                    <SidebarMenuSub>
                                                        {item.items.map((subItem) => {
                                                            const isSubActive = pathname === subItem.url
                                                            return (
                                                                <SidebarMenuSubItem key={subItem.title}>
                                                                    <SidebarMenuSubButton
                                                                        asChild
                                                                        isActive={isSubActive}
                                                                        className="hover:bg-primary/10 hover:text-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary transition-all duration-200 ease-in-out"
                                                                    >
                                                                        <Link href={subItem.url} onClick={() => isMobile && setOpenMobile(false)}>
                                                                            {/* Optional: Add icons to sub-menus if desired */}
                                                                            <span>{subItem.title}</span>
                                                                        </Link>
                                                                    </SidebarMenuSubButton>
                                                                </SidebarMenuSubItem>
                                                            )
                                                        })}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            </SidebarMenuItem>
                                        </Collapsible>
                                    )
                                }

                                // Render simple link
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip={item.title}
                                            isActive={isActive}
                                            className="hover:bg-primary/10 hover:text-primary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground transition-all duration-200 ease-in-out"
                                        >
                                            <Link href={item.url} onClick={() => isMobile && setOpenMobile(false)}>
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="hover:bg-primary/10 hover:text-primary data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground transition-all duration-200 ease-in-out"
                                    suppressHydrationWarning
                                >
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={user?.ProfileImage} alt={user?.UserName || "User"} />
                                        <AvatarFallback className="rounded-lg">{user?.UserName?.slice(0, 2).toUpperCase() || 'CN'}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{user?.UserName || 'User Name'}</span>
                                        <span className="truncate text-xs">{user?.EmailAddress || 'user@example.com'}</span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                side="bottom"
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage src={user?.ProfileImage} alt={user?.UserName || "User"} />
                                            <AvatarFallback className="rounded-lg">{user?.UserName?.slice(0, 2).toUpperCase() || 'CN'}</AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{user?.UserName || 'User Name'}</span>
                                            <span className="truncate text-xs">{user?.EmailAddress || 'user@example.com'}</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/profile" className="cursor-pointer w-full flex items-center" onClick={() => isMobile && setOpenMobile(false)}>
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span onClick={() => {
                                        import('@/actions/auth').then(({ logout }) => logout())
                                    }} className="cursor-pointer w-full">Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
