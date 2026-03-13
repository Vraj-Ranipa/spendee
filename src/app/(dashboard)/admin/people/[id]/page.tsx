import { prisma } from "@/lib/prisma"
import { serializeData } from "@/lib/serialization"
import { notFound } from "next/navigation"
import { PeopleDetailHeader } from "@/components/people/people-detail-header"
import { PeopleFinancials } from "@/components/people/people-financials"
import { PeopleRelatedTransactions } from "@/components/people/people-related-transactions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Phone, Mail, FileText, Calendar } from "lucide-react"

interface PageProps {
    params: Promise<{
        id: string
    }>
}

export default async function PeopleDetailPage({ params }: PageProps) {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    if (isNaN(id)) notFound()

    const person = await prisma.peoples.findUnique({
        where: { PeopleID: id },
        include: {
            users: true,
            expenses: {
                orderBy: { ExpenseDate: 'desc' },
                include: {
                    categories: true
                }
            },
            incomes: {
                orderBy: { IncomeDate: 'desc' },
                include: {
                    categories: true
                }
            }
        }
    })

    if (!person) notFound()

    const serializedPerson = serializeData(person)

    return (
        <div className="flex flex-col min-h-screen w-full bg-muted/5 anime-fade-in">
            {/* Header */}
            <PeopleDetailHeader person={serializedPerson} />

            <main className="flex-1 w-full max-w-[1800px] mx-auto p-4 md:p-6 flex flex-col gap-6">
                
                {/* Financial Overview */}
                <section className="shrink-0">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 px-1">
                        <FileText className="h-5 w-5 text-indigo-500" />
                        Financial Overview
                    </h3>
                    <PeopleFinancials expenses={serializedPerson.expenses} incomes={serializedPerson.incomes} />
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full min-h-0">
                    {/* Left Column: Details (2 cols) */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        
                        {/* Personal Details Card */}
                        <Card className="shadow-md bg-gradient-to-br from-white/90 to-muted/50 dark:from-card/90 dark:to-muted/20 backdrop-blur-xl relative overflow-hidden transition-all hover:shadow-lg group border border-transparent hover:border-primary/30 h-full">
                            <div className="absolute top-0 right-0 p-4 opacity-50">
                                <Phone className="h-64 w-64 text-primary/5 absolute -top-10 -right-10 rotate-12 pointer-events-none" />
                            </div>
                            <CardHeader className="relative z-10 pb-2">
                                <CardTitle className="flex items-center gap-2 text-base font-semibold group-hover:text-primary transition-colors">
                                    <div className="p-1.5 bg-primary/10 rounded group-hover:bg-primary/20 transition-colors">
                                        <FileText className="h-4 w-4 text-primary" />
                                    </div>
                                    Contact Details
                                </CardTitle>
                                <CardDescription>Contact information and notes</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 relative z-10">
                                {/* Phone */}
                                <div className="bg-background/80 p-2 rounded-xl border flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow group/item">
                                    <div className="h-9 w-9 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 dark:bg-orange-950/30 dark:border-orange-900/50 group-hover/item:scale-110 transition-transform">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Mobile Number</p>
                                        <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
                                            {serializedPerson.MobileNo || "Not Provided"}
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="bg-background/80 p-2 rounded-xl border flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow group/item">
                                    <div className="h-9 w-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 dark:bg-blue-950/30 dark:border-blue-900/50 group-hover/item:scale-110 transition-transform">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Email Address</p>
                                        <p className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate" title={serializedPerson.Email || ""}>
                                            {serializedPerson.Email || "Not Provided"}
                                        </p>
                                    </div>
                                </div>
                                
                                    {/* Note/Description */}
                                {serializedPerson.Description && (
                                    <div className="bg-background/80 p-3 rounded-xl border shadow-sm hover:border-primary/20 transition-colors">
                                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">Notes</h4>
                                        <p className="text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap">
                                            {serializedPerson.Description}
                                        </p>
                                    </div>
                                    )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Transactions (3 cols) */}
                    <div className="lg:col-span-3 h-full min-h-0">
                            <PeopleRelatedTransactions expenses={serializedPerson.expenses} incomes={serializedPerson.incomes} />
                    </div>
                </div>
            </main>
        </div>
    )
}

// Helper for class merging if not imported from utility
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
