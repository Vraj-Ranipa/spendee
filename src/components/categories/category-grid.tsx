"use client"

import { useState } from "react"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { CategoryCard, CategoryWithSubCategories } from "./category-card"

interface CategoryGridProps {
    data: CategoryWithSubCategories[]
}

export function CategoryGrid({ data }: CategoryGridProps) {
    // State to act as a search filter for categories and sub-categories
    const [searchQuery, setSearchQuery] = useState("")

    const filteredData = data.filter((category) => {
        const query = searchQuery.toLowerCase()
        const matchesCategory = category.CategoryName.toLowerCase().includes(query)
        const matchesSubCategory = category.sub_categories.some(sub => 
            sub.SubCategoryName.toLowerCase().includes(query)
        )
        return matchesCategory || matchesSubCategory
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search categories or sub-categories..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="text-sm text-muted-foreground">
                    Showing {filteredData.length} of {data.length} categories
                </div>
            </div>

            {filteredData.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed bg-muted/20">
                    <p className="text-muted-foreground">No categories found matching your search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredData.map((category) => (
                        <CategoryCard key={category.CategoryID} category={category} />
                    ))}
                </div>
            )}
        </div>
    )
}
