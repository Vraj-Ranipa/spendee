
import { prisma } from "@/lib/prisma";
import { serializeData } from "@/lib/serialization";
import { notFound } from "next/navigation";
import { ProjectDetailHeader } from "@/components/projects/project-detail-header";
import { ProjectFinancials } from "@/components/projects/project-financials";
import { RelatedTransactions } from "@/components/projects/related-transactions";
import { ProjectExpenseBreakdown } from "@/components/projects/project-expense-breakdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Activity, Calendar, FileText, PieChart } from "lucide-react";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const projectId = parseInt(id);

    if (isNaN(projectId)) {
        return notFound();
    }

    const project = await prisma.projects.findUnique({
        where: {
            ProjectID: projectId,
        },
        include: {
            expenses: {
                orderBy: {
                    ExpenseDate: 'desc'
                },
                take: 50,
                include: {
                    categories: true
                }
            },
            incomes: {
                 orderBy: {
                    IncomeDate: 'desc'
                },
                take: 50,
                include: {
                    categories: true
                }
            }
        },
    });

    if (!project) {
        return notFound();
    }

    const serializedProject = serializeData(project);

    return (
        <div className="flex flex-col min-h-screen w-full bg-muted/5">
            <ProjectDetailHeader project={serializedProject} />

            <div className="flex-1 flex flex-col gap-6 max-w-[1800px] mx-auto w-full p-4 md:p-6">
                {/* Top Row: Financials */}
                <section className="shrink-0">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 px-1">
                        <Activity className="h-5 w-5 text-indigo-500" />
                        Financial Overview
                    </h3>
                    <ProjectFinancials expenses={serializedProject.expenses} incomes={serializedProject.incomes} />
                </section>

                {/* Main Content Grid 2 columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                    {/* Left Column: Project Info & Analytics (3 cols - 60%) */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                         {/* About Project */}
                         <Card className="shadow-md bg-gradient-to-br from-white/90 to-muted/50 dark:from-card/90 dark:to-muted/20 backdrop-blur-xl relative overflow-hidden transition-all hover:shadow-lg group border border-transparent hover:border-primary/30">
                            <div className="absolute top-0 right-0 p-4 opacity-50">
                                <FileText className="h-64 w-64 text-primary/5 absolute -top-10 -right-10 rotate-12 pointer-events-none" />
                            </div>
                            <CardHeader className="pb-2 relative z-10">
                                <CardTitle className="flex items-center gap-2 text-base font-semibold group-hover:text-primary transition-colors">
                                    <div className="p-1.5 bg-primary/10 rounded group-hover:bg-primary/20 transition-colors">
                                        <FileText className="h-4 w-4 text-primary" />
                                    </div>
                                    About Project
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-4 relative z-10">
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Description</h4>
                                    <p className="text-sm leading-relaxed text-foreground/80">
                                        {serializedProject.Description || "No description provided."}
                                    </p>
                                </div>
                                
                                {serializedProject.ProjectDetail && (
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Additional Notes</h4>
                                        <div className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap bg-background/50 p-3 rounded-md border border-border/50 backdrop-blur-sm">
                                            {serializedProject.ProjectDetail}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                    <div className="flex items-start gap-3 group">
                                        <div className="h-8 w-8 rounded-md bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center shrink-0 transition-colors group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40">
                                            <Calendar className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase">Start Date</p>
                                            <p className="font-semibold text-sm">
                                                    {serializedProject.ProjectStartDate ? format(new Date(serializedProject.ProjectStartDate), "PPP") : "Not set"}
                                            </p>
                                        </div>
                                    </div>
                                        <div className="flex items-start gap-3 group">
                                            <div className="h-8 w-8 rounded-md bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center shrink-0 transition-colors group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40">
                                            <Calendar className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase">End Date</p>
                                            <p className="font-semibold text-sm">
                                                    {serializedProject.ProjectEndDate ? format(new Date(serializedProject.ProjectEndDate), "PPP") : "Ongoing"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Analytics */}
                         <Card className="shadow-md bg-gradient-to-br from-white/90 to-muted/50 dark:from-card/90 dark:to-muted/20 backdrop-blur-xl relative overflow-hidden transition-all hover:shadow-lg group border border-transparent hover:border-primary/30">
                            <div className="absolute top-0 right-0 p-4 opacity-50">
                                <PieChart className="h-64 w-64 text-primary/5 absolute -top-10 -right-10 minus-rotate-12 pointer-events-none" />
                            </div>
                            <CardHeader className="relative z-10">
                                <CardTitle className="flex items-center gap-2 text-base group-hover:text-primary transition-colors">
                                    <div className="p-1.5 bg-primary/10 rounded group-hover:bg-primary/20 transition-colors">
                                        <PieChart className="h-4 w-4 text-primary" />
                                    </div>
                                    Analytics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <ProjectExpenseBreakdown expenses={serializedProject.expenses} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Transactions (2 col - 40%) */}
                    <div className="lg:col-span-1 h-full min-h-0">
                        <RelatedTransactions expenses={serializedProject.expenses} incomes={serializedProject.incomes} />
                    </div>
                </div>
            </div>
        </div>
    );
}
