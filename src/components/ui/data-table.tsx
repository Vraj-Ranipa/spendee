"use client"
// Force rebuild to fix hydration mismatch

import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    ColumnFiltersState,
    getFilteredRowModel,
    VisibilityState,
} from "@tanstack/react-table"

import Papa from "papaparse"
import * as XLSX from "xlsx"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, DownloadIcon, FileTextIcon, FileSpreadsheetIcon } from "lucide-react"
import { DataTablePagination } from "./data-table-pagination"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    filterKey?: string
    filterKeys?: { id: string; title: string }[]
    initialColumnVisibility?: VisibilityState
}

export function DataTable<TData, TValue>({
    columns,
    data,
    filterKey,
    filterKeys,
    initialColumnVisibility = {},
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(initialColumnVisibility)
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = React.useState("")

    const filteredData = React.useMemo(() => {
        if (!globalFilter) return data
        const search = globalFilter.toLowerCase()

        return data.filter((item) => {
            if (filterKeys && filterKeys.length > 0) {
                return filterKeys.some((key) => {
                    const col = columns.find((c: any) => c.id === key.id || c.accessorKey === key.id)
                    const accessor = (col as any)?.accessorKey
                    if (!accessor) return false

                    const value = accessor.split('.').reduce((acc: any, part: string) => acc && acc[part], item)
                    return String(value ?? "").toLowerCase().includes(search)
                })
            }
            // Fallback: simple search on top-level values
            return Object.values(item as any).some((val) =>
                String(val ?? "").toLowerCase().includes(search)
            )
        })
    }, [data, globalFilter, filterKeys, columns])

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    const processDataForExport = (data: any[]) => {
        return data.map(item => {
            const newItem: any = {}
            Object.keys(item).forEach(key => {
                // Remove ID fields (case-insensitive check for fields ending in 'id')
                if (key.toLowerCase() === 'id' || key.toLowerCase().endsWith('id')) {
                    return
                }

                const value = item[key]

                // Handle nested objects
                if (value && typeof value === 'object' && !Array.isArray(value)) {
                    if ('name' in value) {
                        newItem[key] = value.name
                    } else if ('title' in value) {
                        newItem[key] = value.title
                    } else if ('CategoryName' in value) {
                        newItem[key] = value.CategoryName
                    } else if ('SubCategoryName' in value) {
                        newItem[key] = value.SubCategoryName
                    } else if ('ProjectName' in value) {
                        newItem[key] = value.ProjectName
                    } else if ('PeopleName' in value) {
                        newItem[key] = value.PeopleName
                    } else {
                        // Fallback: try to find any key ending in 'Name'
                        const nameKey = Object.keys(value).find(k => k.endsWith('Name') && typeof value[k] === 'string')
                        if (nameKey) {
                            newItem[key] = value[nameKey]
                        } else {
                            newItem[key] = JSON.stringify(value)
                        }
                    }
                } else if (Array.isArray(value)) {
                    newItem[key] = value.map((v: any) => {
                         if (typeof v === 'object' && v !== null) {
                             if ('name' in v) return v.name
                             if ('title' in v) return v.title
                             if ('CategoryName' in v) return v.CategoryName
                             if ('SubCategoryName' in v) return v.SubCategoryName
                             if ('ProjectName' in v) return v.ProjectName
                             if ('PeopleName' in v) return v.PeopleName
                             const nameKey = Object.keys(v).find(k => k.endsWith('Name') && typeof v[k] === 'string')
                             if (nameKey) return v[nameKey]
                         }
                         return v
                    }).join(', ')
                } else {
                    newItem[key] = value
                }
            })
            return newItem
        })
    }

    const exportToCSV = () => {
        const selectedRows = table.getSelectedRowModel().rows
        const dataToExport = selectedRows.length > 0
            ? selectedRows.map(row => row.original)
            : table.getFilteredRowModel().rows.map(row => row.original)

        const processedData = processDataForExport(dataToExport)

        const csv = Papa.unparse(processedData, {
            header: true
        })

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)

        link.setAttribute('href', url)
        link.setAttribute('download', `export-${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const exportToExcel = () => {
        const selectedRows = table.getSelectedRowModel().rows
        const dataToExport = selectedRows.length > 0
            ? selectedRows.map(row => row.original)
            : table.getFilteredRowModel().rows.map(row => row.original)

        const processedData = processDataForExport(dataToExport)

        const worksheet = XLSX.utils.json_to_sheet(processedData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')
        XLSX.writeFile(workbook, `export-${new Date().toISOString().split('T')[0]}.xlsx`)
    }

    const exportToJSON = () => {
        const selectedRows = table.getSelectedRowModel().rows
        const dataToExport = selectedRows.length > 0
            ? selectedRows.map(row => row.original)
            : table.getFilteredRowModel().rows.map(row => row.original)

        const processedData = processDataForExport(dataToExport)

        const json = JSON.stringify(processedData, null, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)

        link.setAttribute('href', url)
        link.setAttribute('download', `export-${new Date().toISOString().split('T')[0]}.json`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="w-full">
            <div className="flex items-center py-4 gap-2 flex-wrap">
                {filterKeys && filterKeys.length > 0 ? (
                    <Input
                        placeholder={`Filter ${filterKeys.map(k => k.title).join(", ")}...`}
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="max-w-sm"
                    />
                ) : filterKey ? (
                    <Input
                        placeholder="Filter..."
                        value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn(filterKey)?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                ) : null}
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            <DownloadIcon className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={exportToCSV}>
                            <FileTextIcon className="mr-2 size-4" />
                            Export as CSV
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={exportToExcel}>
                            <FileSpreadsheetIcon className="mr-2 size-4" />
                            Export as Excel
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={exportToJSON}>
                            <FileTextIcon className="mr-2 size-4" />
                            Export as JSON
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-2">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="py-4">
                <DataTablePagination table={table} />
            </div>
        </div>
    )
}
