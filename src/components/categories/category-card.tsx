
import Link from "next/link"
import { categories, sub_categories } from "@prisma/client"
import { 
    MoreHorizontal, 
    Edit, 
    Trash, 
    Copy, 
    TrendingUp, 
    TrendingDown,
    Calendar,
    CheckCircle2,
    XCircle,
    Tag,
    Layers,
    Eye
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Logo } from "@/components/shared/logo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
    Card, 
    CardContent, 
    CardFooter, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card"
import { ActionMenu } from "@/components/shared/action-menu"

export type CategoryWithSubCategories = categories & {
    sub_categories: sub_categories[]
}

interface CategoryCardProps {
    category: CategoryWithSubCategories
}

export function CategoryCard({ category }: CategoryCardProps) {
    const isExpense = category.IsExpense
    const isIncome = category.IsIncome
    const isActive = category.IsActive

    return (
        <Card className={cn(
            "group relative overflow-hidden transition-all duration-300 py-0 gap-0", // Removed default padding and gap
            "hover:shadow-xl hover:-translate-y-1 border",
            isExpense ? "bg-gradient-to-br from-red-100/50 via-white to-white dark:from-red-900/30 dark:via-slate-950 dark:to-slate-950" : 
            isIncome ? "bg-gradient-to-br from-emerald-100/50 via-white to-white dark:from-emerald-900/30 dark:via-slate-950 dark:to-slate-950" : 
            "bg-gradient-to-br from-slate-100/50 via-white to-white dark:from-slate-800/30 dark:via-slate-950 dark:to-slate-950"
        )}>
            <div className="absolute -right-2 -bottom-6 opacity-5 dark:opacity-20 pointer-events-none transition-transform group-hover:scale-110 duration-500">
                {isExpense ? <TrendingDown className="h-40 w-40 text-red-500 dark:text-red-900" /> : 
                 isIncome ? <TrendingUp className="h-40 w-40 text-emerald-500 dark:text-emerald-900" /> : 
                 <Tag className="h-40 w-40 text-slate-500 dark:text-slate-800" />}
            </div>

            <div className="flex items-center justify-between px-3 pt-2 pb-0 relative z-20">
                <Badge 
                    variant="secondary" 
                    className={cn("px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full border shadow-sm", 
                        isExpense ? "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900/30" : 
                        isIncome ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/30" : 
                        "bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-800"
                    )}
                >
                    {isExpense ? "Expense" : isIncome ? "Income" : "Other"}
                </Badge>

                <ActionMenu
                    align="end"
                    viewHref={`/admin/categories/${category.CategoryID}`}
                    editHref={`/admin/categories/edit/${category.CategoryID}`}
                    editLabel="Edit Category"
                    model="categories"
                    id={category.CategoryID.toString()}
                    deletePath="/admin/categories"
                    deleteLabel="Delete Category"
                    className="h-7 w-7 bg-white/50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-900 shadow-sm backdrop-blur-sm -mr-1"
                />
            </div>

            <CardContent className="pt-2 pb-5 px-5 space-y-5 relative z-10">
                <Link href={`/admin/categories/${category.CategoryID}`} className="block h-full group/link">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className={cn(
                        "p-1 rounded-2xl shadow-sm border transition-colors group-hover/link:border-primary/30",
                         isExpense ? "bg-gradient-to-br from-red-50 to-white border-red-100 dark:from-red-950/20 dark:to-slate-950 dark:border-red-900/30" : 
                         isIncome ? "bg-gradient-to-br from-emerald-50 to-white border-emerald-100 dark:from-emerald-950/20 dark:to-slate-950 dark:border-emerald-900/30" : 
                         "bg-gradient-to-br from-slate-50 to-white border-slate-100 dark:from-slate-900/20 dark:to-slate-950 dark:border-slate-800"
                    )}>
                         <Logo 
                            path={category.LogoPath} 
                            alt={category.CategoryName} 
                            fallbackClassName={cn(
                                "h-12 w-12 sm:h-14 sm:w-14 rounded-xl flex items-center justify-center transition-all duration-300",
                                isExpense ? "text-red-500" : 
                                isIncome ? "text-emerald-500" : 
                                "text-slate-500"
                            )}
                            fallbackIcon={
                                isExpense ? <TrendingDown className="h-6 w-6 sm:h-7 sm:w-7 transition-all duration-300" /> : 
                                isIncome ? <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7 transition-all duration-300" /> : 
                                <Tag className="h-6 w-6 sm:h-7 sm:w-7 transition-all duration-300" />
                            }
                        />
                    </div>
                    
                    <div className="space-y-1 min-w-0 flex-1">
                        <CardTitle className="text-base sm:text-lg font-bold tracking-tight text-foreground line-clamp-1 transition-all duration-300 group-hover/link:text-primary">
                            {category.CategoryName}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-xs">
                             {isActive ? (
                                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                                    <span className="relative flex h-1.5 w-1.5">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                    </span>
                                    Active
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                    <XCircle className="h-3 w-3" /> Inactive
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mt-5">
                    <div className={cn(
                        "p-1 rounded-lg border shadow-sm transition-colors",
                        isExpense ? "bg-gradient-to-br from-red-50/50 to-transparent border-red-100/50 dark:from-red-950/10 dark:border-red-900/20" : 
                        isIncome ? "bg-gradient-to-br from-emerald-50/50 to-transparent border-emerald-100/50 dark:from-emerald-950/10 dark:border-emerald-900/20" : 
                        "bg-gradient-to-br from-slate-50/50 to-transparent border-slate-100/50 dark:from-slate-900/10 dark:border-slate-800/20"
                    )}>
                        <p className="text-muted-foreground mb-0.5 font-medium text-[9px] uppercase tracking-wider flex items-center gap-1">
                            <Calendar className="h-2.5 w-2.5 opacity-70" />
                            Created
                        </p>
                        <div className="font-bold text-xs text-foreground/90">
                            {new Date(category.Created).toLocaleDateString()}
                        </div>
                    </div>
                    <div className={cn(
                        "p-1 rounded-lg border shadow-sm transition-colors",
                        isExpense ? "bg-gradient-to-br from-red-50/50 to-transparent border-red-100/50 dark:from-red-950/10 dark:border-red-900/20" : 
                        isIncome ? "bg-gradient-to-br from-emerald-50/50 to-transparent border-emerald-100/50 dark:from-emerald-950/10 dark:border-emerald-900/20" : 
                        "bg-gradient-to-br from-slate-50/50 to-transparent border-slate-100/50 dark:from-slate-900/10 dark:border-slate-800/20"
                    )}>
                         <p className="text-muted-foreground mb-0.5 font-medium text-[9px] uppercase tracking-wider flex items-center gap-1">
                            <Layers className="h-2.5 w-2.5 opacity-70" />
                            Sub-Categories
                        </p>
                        <div className="font-bold text-xs text-foreground/90">
                            {category.sub_categories ? category.sub_categories.length : 0} <span className="text-[9px] font-normal text-muted-foreground ml-0.5">Items</span>
                        </div>
                    </div>
                </div>
                
                {category.sub_categories && category.sub_categories.length > 0 && (
                     <div className="pt-1 mt-5">
                        <div className="flex flex-wrap gap-1.5">
                            {category.sub_categories.slice(0, 3).map((sub) => (
                                <span 
                                    key={sub.SubCategoryID} 
                                    className="inline-flex items-center px-2 py-1 rounded-md bg-background border text-[11px] text-muted-foreground shadow-sm max-w-full truncate"
                                >
                                    {sub.SubCategoryName}
                                </span>
                            ))}
                            {category.sub_categories.length > 3 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-[10px] font-medium text-muted-foreground hover:bg-muted/80 transition-colors cursor-default">
                                    +{category.sub_categories.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                )}
                </Link>
            </CardContent>
        </Card>
    )
}
