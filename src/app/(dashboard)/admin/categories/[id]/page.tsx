import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { CategoryDetailHeader } from "@/components/categories/category-detail-header"
import { CategoryFinancials } from "@/components/categories/category-financials"
import { SubCategoryList } from "@/components/categories/sub-category-list"
import { CategoryRelatedTransactions } from "@/components/categories/category-related-transactions"
import { CategoryInfo } from "@/components/categories/category-info"
import { serializeData } from "@/lib/serialization"
import { FileText } from "lucide-react"

interface PageProps {
    params: Promise<{
        id: string
    }>
}

export default async function CategoryDetailPage({ params }: PageProps) {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    
    // Preliminary verification delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    if (isNaN(id)) notFound()

    const category = await prisma.categories.findUnique({
        where: { CategoryID: id },
        include: {
            sub_categories: true,
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

    if (!category) notFound()

    const serializedCategory = serializeData(category)

    // Determine Strict Type
    const isExpense = category.IsExpense;
    const isIncome = category.IsIncome;
    let categoryType: 'expense' | 'income' | 'mixed' = 'mixed';
    if (isExpense && !isIncome) categoryType = 'expense';
    else if (isIncome && !isExpense) categoryType = 'income';

    // Enforce Strict Data Separation
    const effectiveExpenses = categoryType === 'income' ? [] : serializedCategory.expenses;
    const effectiveIncomes = categoryType === 'expense' ? [] : serializedCategory.incomes;

    return (
        <div className="flex flex-col min-h-screen w-full bg-muted/5 anime-fade-in">
            {/* Header */}
            <CategoryDetailHeader category={serializedCategory} />

            <main className="flex-1 w-full max-w-[1800px] mx-auto p-4 md:p-6 flex flex-col gap-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
                    {/* Left Column: Sub-Categories (Swapped) - Sticky */}
                    <div className="sticky top-6 h-fit">
                        <SubCategoryList 
                            subCategories={serializedCategory.sub_categories} 
                            expenses={effectiveExpenses} 
                            incomes={effectiveIncomes} 
                            categoryId={serializedCategory.CategoryID}
                        />
                    </div>

                    {/* Right Column: Info & Transactions (Swapped) */}
                    <div className="flex flex-col gap-6">
                        <CategoryInfo 
                            category={serializedCategory} 
                            expenses={effectiveExpenses} 
                            incomes={effectiveIncomes} 
                        />
                        <CategoryRelatedTransactions 
                            expenses={effectiveExpenses} 
                            incomes={effectiveIncomes} 
                            type={categoryType} 
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}
