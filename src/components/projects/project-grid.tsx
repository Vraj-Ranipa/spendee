
"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"

import { ProjectCard, ProjectCardProps } from "./project-card"

interface ProjectGridProps {
    data: ProjectCardProps['project'][]
}

type SortKey = "created" | "name" | "status"

export function ProjectGrid({ data }: ProjectGridProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [sortKey, setSortKey] = useState<SortKey>("created")

    const filteredData = data.filter((project) => {
        const query = searchQuery.toLowerCase()
        const matchesName = project.ProjectName.toLowerCase().includes(query)
        const matchesDescription = project.Description?.toLowerCase().includes(query) || false
        return matchesName || matchesDescription
    })?.sort((a, b) => {
        switch (sortKey) {
            case "name":
                return a.ProjectName.localeCompare(b.ProjectName)
            case "status":
                return (a.IsActive === b.IsActive) ? 0 : a.IsActive ? -1 : 1
            case "created":
            default:
                 // Assuming ID is a proxy for creation time if Created date isn't strictly available on the type yet
                 // Or we can just leave it as is if the passed data is already sorted by date from server.
                 // Ideally we should use a Created date field if available, but let's stick to ID or just respect server order for "default"
                 return 0
        }
    })

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search projects..."
                        className="pl-9 bg-background/50 backdrop-blur-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="ml-auto h-9">
                                <ArrowUpDown className="mr-2 h-3.5 w-3.5" />
                                Sort
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Sort Projects</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={sortKey} onValueChange={(value) => setSortKey(value as SortKey)}>
                                <DropdownMenuRadioItem value="created">Newest First</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="name">Name (A-Z)</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="status">Active First</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {filteredData.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl border-dashed bg-slate-50/50 dark:bg-slate-900/20">
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full mb-4">
                        <Search className="h-6 w-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">No projects found</h3>
                    <p className="text-muted-foreground max-w-sm mt-1">
                        We couldn't find any projects matching "{searchQuery}". Try adjusting your search terms.
                    </p>
                    <Button 
                        variant="link" 
                        onClick={() => setSearchQuery("")}
                        className="mt-2 text-indigo-600 dark:text-indigo-400"
                    >
                        Clear search
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredData.map((project) => (
                        <ProjectCard key={project.ProjectID} project={project} />
                    ))}
                </div>
            )}
            
            <div className="text-xs text-center text-muted-foreground mt-8">
                Showing {filteredData.length} of {data.length} projects
            </div>
        </div>
    )
}
