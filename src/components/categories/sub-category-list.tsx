"use client";

import Link from "next/link";
import { format } from "date-fns";
import { 
    Folder, Tag, Plus, Calendar, ArrowUpRight, ArrowDownLeft, 
    Calculator, TrendingUp, Clock, Percent, MoreHorizontal, 
    Pencil, Trash2 
} from "lucide-react";

import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription 
} from "@/components/ui/card";
import { ActionMenu } from "@/components/shared/action-menu";

interface SubCategoryListProps {
    subCategories: any[];
    expenses?: any[];
    incomes?: any[];
    categoryId: number;
}

export function SubCategoryList({ subCategories, expenses = [], incomes = [], categoryId }: SubCategoryListProps) {
    return (
        <Card className="shadow-md bg-gradient-to-br from-white/90 to-muted/50 dark:from-card/90 dark:to-muted/20 backdrop-blur-xl relative overflow-hidden transition-all hover:shadow-lg group border border-transparent hover:border-primary/30 h-full flex flex-col">
            <div className="absolute top-0 right-0 p-4 opacity-50">
                <Tag className="h-64 w-64 text-primary/5 absolute -top-10 -right-10 rotate-12 pointer-events-none" />
            </div>
            <CardHeader className="relative z-10 pb-2 flex flex-row items-center justify-between space-y-0 shrink-0">
                <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold group-hover:text-primary transition-colors">
                        <div className="p-1.5 bg-primary/10 rounded group-hover:bg-primary/20 transition-colors">
                            <Tag className="h-4 w-4 text-primary" />
                        </div>
                        Sub-Categories
                    </CardTitle>
                    <CardDescription>Detailed breakdown by sub-category</CardDescription>
                </div>
                <Button asChild size="sm" variant="outline" className="h-8 gap-1.5 bg-background/50 hover:bg-background hover:text-primary transition-colors">
                    <Link href={`/admin/categories/${categoryId}/subcategories/new`}>
                        <Plus className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Add New</span>
                        <span className="sm:hidden">Add</span>
                    </Link>
                </Button>
            </CardHeader>
            <CardContent className="space-y-3 relative z-10 p-3 pt-0 flex-1 min-h-0">
                {subCategories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center bg-background/50 rounded-xl border border-dashed">
                        <Tag className="h-8 w-8 text-muted-foreground/30 mb-2" />
                        <p className="text-xs text-muted-foreground font-medium">No sub-categories</p>
                    </div>
                ) : (
                    <ScrollArea className="h-[350px] md:h-[450px] lg:h-[500px] w-full rounded-md border bg-background/50">
                        <div className="grid gap-2 p-3">
                         {(() => {
                            const overallTotal = [...expenses, ...incomes].reduce((acc, item) => acc + Number(item.Amount || 0), 0);
                            
                            return subCategories.map((sub) => {
                                const subExpenses = expenses.filter(e => e.SubCategoryID === sub.SubCategoryID);
                                const subIncomes = incomes.filter(i => i.SubCategoryID === sub.SubCategoryID);
                                const txCount = subExpenses.length + subIncomes.length;
                                
                                const totalEx = subExpenses.reduce((acc: number, c: any) => acc + Number(c.Amount), 0);
                                const totalInc = subIncomes.reduce((acc: number, c: any) => acc + Number(c.Amount), 0);
                                const totalActivity = totalEx + totalInc;
                                
                                const percent = overallTotal > 0 ? (totalActivity / overallTotal) * 100 : 0;

                                // Find last activity date
                                const dates = [
                                    ...subExpenses.map((e: any) => new Date(e.ExpenseDate).getTime()), 
                                    ...subIncomes.map((i: any) => new Date(i.IncomeDate).getTime())
                                ];
                                const lastActivity = dates.length > 0 ? new Date(Math.max(...dates)) : null;

                                // New Stats
                                const allAmounts = [...subExpenses, ...subIncomes].map(x => Number(x.Amount));
                                const maxAmount = allAmounts.length ? Math.max(...allAmounts) : 0;
                                const avgAmount = txCount > 0 ? totalActivity / txCount : 0;

                                return (
                                    <div key={sub.SubCategoryID} className="bg-background/80 p-3 rounded-xl border flex flex-col gap-3 shadow-sm hover:shadow-md transition-all group/item hover:border-primary/20 min-w-0">
                                        
                                        {/* Top Row: Identity & Actions */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <div className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 dark:bg-indigo-950/30 dark:border-indigo-900/50 group-hover/item:scale-110 transition-transform shrink-0 overflow-hidden">
                                                    {sub.LogoPath ? (
                                                        <img 
                                                            src={sub.LogoPath} 
                                                            alt={sub.SubCategoryName} 
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <Tag className="h-5 w-5" />
                                                    )}
                                                </div>
                                                <div className="space-y-0.5 min-w-0 w-full">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">{sub.SubCategoryName}</p>
                                                        {!sub.IsActive && <Badge variant="destructive" className="h-4 text-[9px] px-1 py-0">Inactive</Badge>}
                                                    </div>
                                                    <p className="text-[10px] text-muted-foreground truncate w-full block" title={sub.Description || "No description"}>
                                                        {sub.Description || "No description"}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-start gap-2 shrink-0">
                                                 <div className="text-right flex flex-col items-end gap-0.5 mt-1">
                                                    {totalInc > 0 && (
                                                        <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                                            <ArrowDownLeft className="h-3 w-3" />
                                                            {formatCurrency(totalInc)}
                                                        </p>
                                                    )}
                                                    {totalEx > 0 && (
                                                        <p className="text-xs font-bold text-rose-600 flex items-center gap-1">
                                                            <ArrowUpRight className="h-3 w-3" />
                                                            {formatCurrency(totalEx)}
                                                        </p>
                                                    )}
                                                    {totalInc === 0 && totalEx === 0 && (
                                                         <p className="text-xs font-medium text-muted-foreground">No activity</p>
                                                    )}
                                                </div>

                                                <ActionMenu
                                                    align="end"
                                                    editHref={`/admin/categories/${categoryId}/subcategories/edit/${sub.SubCategoryID}`}
                                                    editLabel="Edit Sub-Category"
                                                    model="sub_categories"
                                                    id={sub.SubCategoryID.toString()}
                                                    deletePath={`/admin/categories/${categoryId}`}
                                                    deleteLabel="Delete Sub-Category"
                                                    className="h-8 w-8 -mr-2 rounded-full hover:bg-muted"
                                                />
                                            </div>
                                        </div>

                                        {/* Stats Grid - Enhanced Info */}
                                        <div className="grid grid-cols-2 xs:grid-cols-4 gap-2 py-2 px-3 bg-muted/30 rounded-lg text-xs border border-border/50">
                                             <div className="flex flex-col gap-0.5">
                                                 <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
                                                     <Calculator className="h-3 w-3" /> Count
                                                 </span>
                                                 <span className="font-medium text-foreground">{txCount}</span>
                                             </div>
                                             
                                             <div className="flex flex-col gap-0.5">
                                                 <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
                                                     <Percent className="h-3 w-3" /> Avg
                                                 </span>
                                                 <span className="font-medium text-foreground">{formatCurrency(avgAmount)}</span>
                                             </div>

                                             <div className="flex flex-col gap-0.5">
                                                 <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
                                                     <TrendingUp className="h-3 w-3" /> Max
                                                 </span>
                                                 <span className="font-medium text-foreground">{formatCurrency(maxAmount)}</span>
                                             </div>

                                             <div className="flex flex-col gap-0.5">
                                                 <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
                                                     <Clock className="h-3 w-3" /> Last 
                                                 </span>
                                                 <span className="font-medium text-foreground">{lastActivity ? format(lastActivity, "MMM d") : "-"}</span>
                                             </div>
                                        </div>

                                        {/* Activity Bar */}
                                        <div className="space-y-1 mt-1">
                                            <div className="w-full bg-muted/50 rounded-full h-1.5 overflow-hidden flex">
                                                <div 
                                                    className={`h-full transition-all duration-500 ${totalEx > totalInc ? 'bg-rose-500/70' : 'bg-emerald-500/70'}`} 
                                                    style={{ width: `${Math.max(percent, 2)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            });
                         })()}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
}
