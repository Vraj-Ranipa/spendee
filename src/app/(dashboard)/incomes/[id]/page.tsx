import { prisma } from "@/lib/prisma";

import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
    ArrowLeft, Calendar, User, Briefcase, FileText, Tag, Layers, 
    Paperclip, Phone, Mail, Hash, Clock, Edit, Trash2, ExternalLink, MoreHorizontal
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteButton from "@/components/shared/delete-button";

function DetailItem({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
             <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</h4>
             <div className="text-sm leading-relaxed bg-muted/40 p-3 rounded-lg border border-transparent hover:border-border transition-colors break-words whitespace-pre-wrap">
                {children}
             </div>
        </div>
    );
}

import { Logo } from "@/components/shared/logo";


function EmptyState({ label }: { label: string }) {
    return (
        <span className="text-muted-foreground italic flex items-center gap-2 text-xs">
            <span className="h-1 w-1 bg-muted-foreground/50 rounded-full block" /> {label}
        </span>
    );
}

export default async function IncomeDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const incomeId = parseInt(id);

    if (isNaN(incomeId)) {
        return notFound();
    }

    const income = await prisma.incomes.findUnique({
        where: {
            IncomeID: incomeId,
        },
        include: {
            categories: true,
            sub_categories: true,
            peoples: true,
            projects: true,
        },
    });

    if (!income) {
        return notFound();
    }

    return (
        <div className="flex flex-col h-full w-full bg-gradient-to-b from-muted/50 to-background anime-fade-in overflow-hidden">
            {/* Top Navigation & Actions */}
            <div className="flex-none px-4 py-3 md:px-6 border-b border-border/60 bg-background/90 backdrop-blur-xl z-10 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-muted/80 transition-colors h-8 w-8">
                            <Link href="/incomes">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                                    Income Details
                                </h1>
                                <Badge variant="outline" className="font-mono text-xs h-5 px-1.5 bg-background/50 backdrop-blur-sm border-primary/20">
                                    #{income.IncomeID}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                 <Clock className="h-3 w-3" />
                                 <span>Created {format(new Date(income.Created), "PPP")}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 ml-auto sm:ml-0">
                        <Button variant="outline" size="sm" className="h-8 text-xs hover:border-primary/50 hover:bg-primary/5 transition-all px-3 hidden sm:flex" asChild>
                            <Link href={`/incomes/edit/${income.IncomeID}`}>
                                <Edit className="h-3.5 w-3.5 mr-1.5" />
                                Edit Income
                            </Link>
                        </Button>
                        <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 sm:hidden">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href={`/incomes/edit/${income.IncomeID}`}>
                                        <Edit className="mr-2 h-4 w-4" /> Edit Income
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="p-0 text-destructive focus:text-destructive" onSelect={(e) => e.preventDefault()}>
                                    <DeleteButton
                                        model="incomes"
                                        id={income.IncomeID.toString()}
                                        redirectTo="/incomes"
                                        deleteLabel="Delete Income"
                                        variant="ghost"
                                        className="w-full justify-start h-auto p-2 text-destructive hover:text-destructive hover:bg-transparent"
                                    />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DeleteButton 
                            model="incomes" 
                            id={income.IncomeID.toString()} 
                            redirectTo="/incomes"
                            className="h-8 text-xs shadow-sm hover:shadow-md transition-all px-3 hidden sm:flex"
                            variant="destructive"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content Grid - Scrollable Container */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full content-start">
                    
                    {/* Column 1: Financial & Project Context */}
                    <div className="flex flex-col gap-4">
                        {/* Hero Card: Amount & Date */}
                        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-emerald-500/20 via-background to-background ring-1 ring-emerald-500/30 hover:ring-emerald-500/50 transition-all duration-500 group relative">
                            <div className="absolute -right-6 -top-6 text-emerald-500/10 rotate-12 pointer-events-none select-none">
                                <Tag className="h-60 w-60" />
                            </div>
                            <CardContent className="p-6 relative z-10">
                                <div className="flex flex-col justify-between gap-5">
                                    <div>
                                        <p className="text-xs font-bold text-emerald-600/90 dark:text-emerald-400/90 mb-1 uppercase tracking-widest">
                                            Total Amount
                                        </p>
                                        <div className="text-4xl sm:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-400 drop-shadow-sm animate-gradient-x bg-[length:200%_auto]">
                                            {formatCurrency(Number(income.Amount))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-background/40 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-sm hover:scale-105 transition-transform duration-300 w-fit">
                                        <div className="p-2 bg-gradient-to-br from-emerald-200 to-teal-100 dark:from-emerald-900/60 dark:to-teal-900/60 rounded-lg shadow-inner">
                                            <Calendar className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                                        </div>
                                        <div className="pr-1">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Transaction Date</p>
                                            <p className="text-base font-bold text-foreground/90">{format(new Date(income.IncomeDate), "PPP")}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Project Context */}
                        <Card className="hover:shadow-md hover:border-primary/30 transition-all duration-300 group overflow-hidden relative bg-gradient-to-br from-card to-muted/20 flex-1">
                            <div className="absolute -left-6 top-1/2 -translate-y-1/2 text-primary/10 rotate-12 pointer-events-none select-none">
                                <Briefcase className="h-48 w-48" />
                            </div>
                            <CardHeader className="pb-2 pt-5 px-5 relative z-10">
                                <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors text-base font-semibold">
                                    <div className="p-1.5 bg-primary/10 rounded group-hover:bg-primary/20 transition-colors">
                                        <Briefcase className="h-4 w-4 text-primary" />
                                    </div>
                                    Project Context
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-5 pb-5 relative z-10">
                                {income.projects ? (
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between p-3 bg-muted/30 rounded-lg border border-dashed border-border/60">
                                            <div className="flex gap-3">
                                                 <Logo 
                                                    path={income.projects.ProjectLogo} 
                                                    alt={income.projects.ProjectName} 
                                                    fallbackClassName="h-10 w-10 rounded-md flex items-center justify-center bg-primary/10 text-primary"
                                                    fallbackIcon={<Briefcase className="h-5 w-5" />}
                                                />
                                                <div>
                                                    <h3 className="text-base font-bold flex items-center gap-2">
                                                        {income.projects.ProjectName}
                                                        {income.projects.IsActive && (
                                                            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse ring-2 ring-green-500/20" />
                                                        )}
                                                        {income.projects.IsActive ? (
                                                            <Badge className="bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/25 border-green-200/50 text-[10px] px-2 py-0.5">Active</Badge>
                                                        ) : (
                                                            <Badge variant="secondary" className="text-[10px] px-2 py-0.5">Inactive</Badge>
                                                        )}
                                                    </h3>
                                                    <p className="text-xs text-muted-foreground mt-0.5">{income.projects.Description}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                                            <div className="flex flex-col gap-1 p-2 rounded focus-within:bg-muted/30 hover:bg-muted/30 transition-colors">
                                                <span className="text-muted-foreground text-[10px] uppercase tracking-wide font-bold">Start Date</span>
                                                <span className="font-semibold font-mono text-sm text-foreground/80">
                                                    {income.projects.ProjectStartDate ? format(new Date(income.projects.ProjectStartDate), "PP") : "N/A"}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-1 p-2 rounded focus-within:bg-muted/30 hover:bg-muted/30 transition-colors">
                                                <span className="text-muted-foreground text-[10px] uppercase tracking-wide font-bold">End Date</span>
                                                <span className="font-semibold font-mono text-sm text-foreground/80">
                                                    {income.projects.ProjectEndDate ? format(new Date(income.projects.ProjectEndDate), "PP") : "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed hover:bg-muted/30 transition-colors">
                                        <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                        <p className="text-xs">No project linked.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Column 2: Details & Description (Primary Info) */}
                    <div className="flex flex-col gap-4 h-full">
                        <Card className="hover:shadow-md hover:border-primary/30 transition-all duration-300 group overflow-hidden relative bg-gradient-to-br from-card to-muted/20 h-full flex flex-col">
                            <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-primary/10 -rotate-12 pointer-events-none select-none">
                                <FileText className="h-64 w-64" />
                            </div>
                            <CardHeader className="pb-2 pt-5 px-5 flex-none relative z-10">
                                <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors text-base font-semibold">
                                    <div className="p-1.5 bg-primary/10 rounded group-hover:bg-primary/20 transition-colors">
                                        <FileText className="h-4 w-4 text-primary" />
                                    </div>
                                    Details & Notes
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 px-5 pb-5 relative z-10 flex-1">
                                <div className="space-y-4">
                                    <DetailItem title="Income Detail">
                                        {income.IncomeDetail ? <p className="text-base leading-relaxed">{income.IncomeDetail}</p> : <EmptyState label="No details" />}
                                    </DetailItem>
                                    <DetailItem title="Description">
                                        {income.Description ? <p className="text-sm text-muted-foreground leading-relaxed">{income.Description}</p> : <EmptyState label="No description" />}
                                    </DetailItem>
                                </div>
                                
                                {income.AttachmentPath && (
                                    <div className="mt-auto">
                                        <Separator className="bg-border/60 mb-4" />
                                        <div>
                                            <h4 className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Attachment</h4>
                                            <div className="flex items-center justify-between p-3 border rounded-lg bg-gradient-to-r from-muted/40 to-background hover:from-muted/60 transition-all group/file cursor-pointer">
                                                <div className="flex items-center gap-3 flex-1 min-w-0 mr-3">
                                                    <div className="p-2 bg-blue-100/60 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded shadow-sm group-hover/file:scale-110 transition-transform flex-shrink-0">
                                                        <Paperclip className="h-4 w-4" />
                                                    </div>
                                                    <div className="space-y-0.5 min-w-0 w-full">
                                                        <p className="text-sm font-semibold truncate group-hover/file:text-blue-600 transition-colors">
                                                            {income.AttachmentPath.split(/[/\\]/).pop()}
                                                        </p>
                                                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                            Attached Document 
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5 text-muted-foreground group-hover/file:text-foreground" asChild>
                                                    <Link href={`/view-attachment/income/${income.IncomeID}`} scroll={false}>
                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                        Open
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Column 3: Classification & Payer & Meta */}
                    <div className="flex flex-col gap-4">
                        {/* Classification */}
                        <Card className="hover:shadow-md hover:border-primary/30 transition-all duration-300 group overflow-hidden relative bg-gradient-to-br from-card to-muted/20">
                            <div className="absolute -right-2 top-1/2 -translate-y-1/2 text-emerald-500/10 -rotate-12 pointer-events-none select-none">
                                <Layers className="h-32 w-32" />
                            </div>
                            <CardHeader className="pb-2 pt-5 px-5">
                                <CardTitle className="text-base font-semibold flex items-center gap-2 group-hover:text-primary transition-colors">
                                    <div className="p-1.5 bg-primary/10 rounded group-hover:bg-primary/20 transition-colors">
                                        <Tag className="h-4 w-4 text-primary" />
                                    </div>
                                    Classification
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 px-5 pb-5 relative z-10">
                                <div className="p-3 rounded-lg hover:bg-muted/40 transition-colors bg-gradient-to-r from-transparent to-muted/20 border border-transparent hover:border-border/50">
                                    <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider font-bold">Category</p>
                                    <div className="flex items-center gap-3">
                                        <Logo 
                                            path={income.categories?.LogoPath} 
                                            alt={income.categories?.CategoryName || "Category"} 
                                            fallbackClassName="h-10 w-10 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm flex items-center justify-center text-white text-xs font-black"
                                            fallbackIcon={<span>{income.categories?.CategoryName?.charAt(0) || "U"}</span>}
                                        />
                                        <div>
                                            <span className="font-bold text-lg block leading-none mb-1">{income.categories?.CategoryName || "Uncategorized"}</span>
                                            {income.categories?.Description && (
                                                <p className="text-[11px] text-muted-foreground/80 leading-tight line-clamp-1">{income.categories.Description}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <Separator className="bg-border/60" />
                                <div className="p-3 rounded-lg hover:bg-muted/40 transition-colors border border-transparent hover:border-border/50">
                                    <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider font-bold">Sub-Category</p>
                                    <div className="flex items-center gap-2">
                                        <Logo
                                            path={income.sub_categories?.LogoPath}
                                            alt={income.sub_categories?.SubCategoryName || "Sub Category"}
                                            fallbackClassName="h-6 w-6 rounded overflow-hidden flex items-center justify-center bg-muted/20"
                                            fallbackIcon={<Layers className="h-4 w-4 text-muted-foreground" />}
                                        />
                                        <span className="text-base font-medium">{income.sub_categories?.SubCategoryName || "None"}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payer Information */}
                        <Card className="hover:shadow-md hover:border-primary/30 transition-all duration-300 group overflow-hidden relative bg-gradient-to-br from-card to-muted/20">
                            <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-blue-500/10 rotate-6 pointer-events-none select-none">
                                <User className="h-36 w-36" />
                            </div>
                            <CardHeader className="pb-2 pt-5 px-5">
                                <CardTitle className="text-base font-semibold flex items-center gap-2 group-hover:text-primary transition-colors">
                                    <div className="p-1.5 bg-primary/10 rounded group-hover:bg-primary/20 transition-colors">
                                        <User className="h-4 w-4 text-primary" />
                                    </div>
                                    Payer Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-5 pb-5 relative z-10">
                                {income.peoples ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-dashed border-border/60">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-black text-sm shadow ring-2 ring-background">
                                                {income.peoples.PeopleName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">{income.peoples.PeopleName}</p>
                                                <p className="text-[10px] text-muted-foreground font-mono bg-background/60 px-1.5 py-0.5 rounded inline-block mt-0.5">
                                                    {income.peoples.PeopleCode || "NO CODE"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-2 pt-0.5">
                                            {income.peoples.Email && (
                                                <div className="flex items-center gap-2.5 text-xs p-2 hover:bg-muted/50 rounded transition-colors overflow-hidden group/item">
                                                    <div className="p-1 bg-background/80 rounded shadow-sm">
                                                        <Mail className="h-3 w-3 text-muted-foreground group-hover/item:text-primary transition-colors" />
                                                    </div>
                                                    <span className="truncate font-medium opacity-90">{income.peoples.Email}</span>
                                                </div>
                                            )}
                                            {income.peoples.MobileNo && (
                                                <div className="flex items-center gap-2.5 text-xs p-2 hover:bg-muted/50 rounded transition-colors group/item">
                                                    <div className="p-1 bg-background/80 rounded shadow-sm">
                                                        <Phone className="h-3 w-3 text-muted-foreground group-hover/item:text-primary transition-colors" />
                                                    </div>
                                                    <span className="font-mono opacity-90">{income.peoples.MobileNo}</span>
                                                </div>
                                            )}
                                        </div>

                                        {income.peoples.Description && (
                                            <div className="pt-2 border-t border-border/50">
                                                 <p className="text-xs text-muted-foreground italic">"{income.peoples.Description}"</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                                        <User className="h-6 w-6 mx-auto mb-2 opacity-30" />
                                        <p className="text-xs">No payer information.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* System Metadata */}
                        <div className="px-2 mt-auto">
                             <div className="space-y-3 text-sm text-muted-foreground/70">
                                <div className="flex justify-between items-center group cursor-help hover:text-muted-foreground transition-colors">
                                    <span className="flex items-center gap-1.5"><Hash className="h-3.5 w-3.5" /> Record ID</span>
                                    <span className="font-mono bg-muted/30 px-2 py-0.5 rounded group-hover:bg-muted/50 transition-colors font-medium">{income.IncomeID}</span>
                                </div>
                                <Separator className="bg-border/40" />
                                <div className="flex justify-between items-center hover:text-muted-foreground transition-colors">
                                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Created</span>
                                    <span className="font-medium">{format(new Date(income.Created), "PP p")}</span>
                                </div>
                                <div className="flex justify-between items-center hover:text-muted-foreground transition-colors">
                                    <span className="flex items-center gap-1.5"><Edit className="h-3.5 w-3.5" /> Modified</span>
                                    <span className="font-medium">{format(new Date(income.Modified), "PP p")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
