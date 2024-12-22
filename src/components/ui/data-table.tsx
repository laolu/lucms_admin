'use client'

import * as React from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useQuery } from '@tanstack/react-query'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  queryKey: string[]
  queryFn: ({ pageIndex, pageSize }: { pageIndex: number; pageSize: number }) => Promise<{
    items: TData[]
    total: number
  }>
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void
  state?: {
    pagination?: {
      pageIndex: number
      pageSize: number
    }
  }
}

export function DataTable<TData, TValue>({
  columns,
  queryKey,
  queryFn,
  onPaginationChange,
  state = {},
}: DataTableProps<TData, TValue>) {
  // ... 原有代码
} 