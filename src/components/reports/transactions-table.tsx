"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Transaction } from "@/types/dashboard"

// Mock Data
const data: Transaction[] = [
  {
    type: 'income',
    IncomeID: 1,
    IncomeDate: "2024-01-15T10:00:00Z",
    Amount: 1500,
    IncomeDetail: "Web Development",
    category: { CategoryID: 1, CategoryName: "Freelance", IsIncome: true, IsExpense: false },
    project: { ProjectID: 101, ProjectName: "Client A" }
  },
  {
    type: 'expense',
    ExpenseID: 10,
    ExpenseDate: "2024-01-16T14:30:00Z",
    Amount: 85.50,
    ExpenseDetail: "Hosting Fee",
    category: { CategoryID: 5, CategoryName: "Software", IsIncome: false, IsExpense: true },
  },
    {
    type: 'income',
    IncomeID: 2,
    IncomeDate: "2024-01-20T09:00:00Z",
    Amount: 3200,
    IncomeDetail: "Salary",
    category: { CategoryID: 6, CategoryName: "Salary", IsIncome: true, IsExpense: false },
  },
  {
    type: 'expense',
    ExpenseID: 11,
    ExpenseDate: "2024-01-21T19:00:00Z",
    Amount: 450,
    ExpenseDetail: "Team Dinner",
    category: { CategoryID: 3, CategoryName: "Food", IsIncome: false, IsExpense: true },
    project: { ProjectID: 102, ProjectName: "Internal" }
  },
]

export const columns: ColumnDef<Transaction>[] = [
  {
    id: "date",
    accessorFn: (row) => row.type === 'expense' ? row.ExpenseDate : row.IncomeDate,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => format(new Date(row.getValue("date")), "MMM d, yyyy"),
  },
  {
      id: "detail",
      accessorFn: (row) => row.type === 'expense' ? row.ExpenseDetail : row.IncomeDetail,
      header: "Detail",
      cell: ({ row }) => <span className="font-medium text-foreground/80">{row.getValue("detail")}</span>
  },
  {
    id: "category",
    accessorFn: (row) => row.category?.CategoryName,
    header: "Category",
    cell: ({ row }) => <Badge variant="secondary" className="font-normal">{row.getValue("category") || "Uncategorized"}</Badge>
  },
  {
      id: "project",
      accessorFn: (row) => row.project?.ProjectName,
      header: "Project",
       cell: ({ row }) => {
           const project = row.getValue("project");
           return project ? <Badge variant="outline">{project as any}</Badge> : <span className="text-muted-foreground italic text-xs">No Project</span>
       } 
  },
  {
    accessorKey: "Amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("Amount"))
      const isExpense = row.original.type === 'expense';
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
 
      return (
        <div className={`text-right font-medium ${isExpense ? "text-rose-500" : "text-emerald-500"}`}>
            {isExpense ? "-" : "+"}{formatted}
        </div>
      )
    },
  },
  {
    id: "type",
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return <Badge variant={type === 'income' ? 'default' : 'destructive'} className="uppercase text-[10px]">{type}</Badge>
    }
  }
]

export function TransactionsTable() {
    const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div className="rounded-md border bg-card">
        <div className="p-4">
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
    </div>
  )
}
