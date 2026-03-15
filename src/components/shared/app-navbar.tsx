"use client"

import * as React from "react"
import Link from "next/link"
import NextImage from "next/image"
import { usePathname } from "next/navigation"
import {
    Briefcase,
    ChevronDown,
    LayoutDashboard,
    LogOut,
    Menu,
    PieChart,
    PlusCircle,
    Settings,
    Tags,
    TrendingDown,
    TrendingUp,
    User as UserIcon,
    Users,
    X,
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"

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

const navItems: { group: string; items: NavItem[] }[] = [
    {
        group: "Overview",
        items: [
            { title: "Dashboard", url: "/", icon: LayoutDashboard },
            { title: "Reports", url: "/reports", icon: PieChart },
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

export function AppNavbar({ userRole = "USER", user }: { userRole?: string; user?: any }) {
    const pathname = usePathname()
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)

    const filteredNavItems = navItems.filter(group => {
        if (group.group === "Management") {
            return userRole.toUpperCase() === "ADMIN"
        }
        return true
    })

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-white p-0.5 overflow-hidden shadow-sm border border-border/50">
                            <NextImage
                                src="/spendee_logo.png"
                                alt="Spendee Logo"
                                width={32}
                                height={32}
                                className="object-contain"
                                priority
                            />
                        </div>
                        <span className="hidden font-bold sm:inline-block text-xl tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Spendee
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex flex-1 items-center justify-center gap-1 mx-8 text-sm font-medium">
                        {filteredNavItems.map((group) => (
                            <div key={group.group} className="flex gap-1 items-center">
                                {group.items.map((item) => {
                                    const isActive = item.url === "/"
                                        ? pathname === "/"
                                        : pathname.startsWith(item.url)

                                    if (item.items && item.items.length > 0) {
                                        return (
                                            <DropdownMenu key={item.title}>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className={cn(
                                                            "h-9 px-4 gap-1.5 transition-all duration-200 hover:bg-primary/10 hover:text-primary",
                                                            isActive && "bg-primary/10 text-primary font-semibold"
                                                        )}
                                                    >
                                                        {item.icon && <item.icon className="size-4" />}
                                                        {item.title}
                                                        <ChevronDown className="size-3 opacity-50" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="start" className="w-48 animate-in fade-in zoom-in-95 duration-200">
                                                    {item.items.map((subItem) => (
                                                        <DropdownMenuItem key={subItem.title} asChild>
                                                            <Link href={subItem.url} className="flex items-center gap-2 cursor-pointer w-full">
                                                                {subItem.icon && <subItem.icon className="size-4" />}
                                                                {subItem.title}
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )
                                    }

                                    return (
                                        <Link
                                            key={item.title}
                                            href={item.url}
                                            className={cn(
                                                "relative flex h-9 items-center gap-1.5 px-4 transition-all duration-200 hover:bg-primary/10 hover:text-primary rounded-md",
                                                isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground"
                                            )}
                                        >
                                            {item.icon && <item.icon className="size-4" />}
                                            {item.title}
                                            {isActive && (
                                                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full animate-in fade-in slide-in-from-bottom-1 duration-300" />
                                            )}
                                        </Link>
                                    )
                                })}
                            </div>
                        ))}
                    </div>

                    {/* Right side: Actions & User Menu */}
                    <div className="flex items-center gap-2">
                        <ModeToggle />
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-offset-background transition-all hover:ring-2 hover:ring-primary/20">
                                    <Avatar className="h-8 w-8 transition-transform hover:scale-105">
                                        <AvatarImage src={user?.ProfileImage} alt={user?.UserName || "User"} />
                                        <AvatarFallback className="bg-primary/5 text-primary">
                                            {user?.UserName?.slice(0, 2).toUpperCase() || 'SP'}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 mt-2 animate-in fade-in zoom-in-95 duration-200" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user?.UserName || 'User Name'}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{user?.EmailAddress || 'user@example.com'}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/profile" className="cursor-pointer flex items-center w-full">
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                    onClick={() => import('@/actions/auth').then(({ logout }) => logout())}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Mobile Menu Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden border-t bg-background/95 backdrop-blur animate-in slide-in-from-top-4 duration-300">
                    <div className="container mx-auto px-4 py-4 space-y-4">
                        {filteredNavItems.map((group) => (
                            <div key={group.group} className="space-y-2">
                                <p className="text-xs font-semibold text-muted-foreground px-4 uppercase tracking-wider">{group.group}</p>
                                {group.items.map((item) => {
                                    const isActive = item.url === "/"
                                        ? pathname === "/"
                                        : pathname.startsWith(item.url)
                                    
                                    return (
                                        <React.Fragment key={item.title}>
                                            <Link
                                                href={item.url}
                                                onClick={() => setIsMenuOpen(false)}
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-all duration-200",
                                                    isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"
                                                )}
                                            >
                                                {item.icon && <item.icon className="size-4" />}
                                                {item.title}
                                            </Link>
                                            {item.items?.map((subItem) => (
                                                <Link
                                                    key={subItem.title}
                                                    href={subItem.url}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="flex items-center gap-3 px-8 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    {subItem.title}
                                                </Link>
                                            ))}
                                        </React.Fragment>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    )
}
