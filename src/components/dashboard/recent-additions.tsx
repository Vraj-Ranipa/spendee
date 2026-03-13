import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Briefcase, Layers } from "lucide-react"

interface RecentAdditionsProps {
    data: {
        projects: any[];
        categories: any[];
    }
}

export function RecentAdditions({ data }: RecentAdditionsProps) {
    return (
        <Card className="border-zinc-200 dark:border-zinc-800 flex flex-col h-full bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900/80 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800/50">
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
                    System Resources
                </CardTitle>
                <CardDescription className="mt-1">
                    Recently added projects and categories.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 relative flex flex-col">
                <Tabs defaultValue="projects" className="w-full flex-1 flex flex-col">
                    <div className="px-6 pt-4 pb-2">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="projects" className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4" />
                                Projects
                            </TabsTrigger>
                            <TabsTrigger value="categories" className="flex items-center gap-2">
                                <Layers className="h-4 w-4" />
                                Categories
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="projects" className="flex-1 mt-0 relative">
                        <ScrollArea className="h-[340px] w-full px-6 pb-4">
                            <div className="space-y-3 pr-4 pb-6">
                                {data.projects.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-8">No active projects found.</p>
                                ) : (
                                    data.projects.map((project, i) => (
                                        <div key={i} className="flex flex-col p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/30 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors cursor-default">
                                            <div className="flex justify-between items-start">
                                                <span className="font-semibold text-sm truncate pr-2">{project.ProjectName}</span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 shrink-0`}>
                                                    Active
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent dark:from-zinc-950 dark:to-transparent pointer-events-none rounded-b-xl z-10" />
                    </TabsContent>

                    <TabsContent value="categories" className="flex-1 mt-0 relative">
                        <ScrollArea className="h-[340px] w-full px-6 pb-4">
                            <div className="space-y-3 pr-4 pb-6">
                                {data.categories.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-8">No categories found.</p>
                                ) : (
                                    data.categories.map((category, i) => (
                                        <div key={i} className="flex flex-col p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/30 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors cursor-default">
                                            <span className="font-semibold text-sm truncate mb-1">{category.CategoryName}</span>
                                            <span className="text-xs text-muted-foreground line-clamp-1">
                                                {category.Description || "No description provided."}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent dark:from-zinc-950 dark:to-transparent pointer-events-none rounded-b-xl z-10" />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
