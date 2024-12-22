'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import { userService, type User } from '@/services/user'
import { usePagination } from '@/hooks/use-pagination'
import { Switch } from '@/components/ui/switch'
import { formatDateTime } from '@/lib/format'
import { AdminLayout } from '@/components/ui/admin-layout'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { AlertDialog } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function UsersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const pagination = usePagination()
  const [users, setUsers] = React.useState<User[]>([])
  const [total, setTotal] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')

  const fetchUsers = React.useCallback(async () => {
    try {
      setLoading(true)
      const { items, total } = await userService.getAll({
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        search: searchQuery
      })
      setUsers(items)
      setTotal(total)
    } catch (error) {
      console.error('获取用户列表失败:', error)
      toast({
        variant: 'destructive',
        description: '获取用户列表失败'
      })
    } finally {
      setLoading(false)
    }
  }, [pagination.pageIndex, pagination.pageSize, searchQuery, toast])

  React.useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <Button asChild>
          <Link href="/admin/users/create">
            <Plus className="mr-2 h-4 w-4" />
            新建
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>用户名</TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead>手机号</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  加载中...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Switch
                      checked={user.isActive}
                      onCheckedChange={async (checked) => {
                        try {
                          await userService.update(user.id, { isActive: checked })
                          toast({
                            description: '更新成功'
                          })
                          fetchUsers()
                        } catch (error) {
                          console.error('更新失败:', error)
                          toast({
                            variant: 'destructive',
                            description: '更新失败'
                          })
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>{formatDateTime(user.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                      >
                        编辑
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          if (!confirm('确定要删除吗？')) return
                          try {
                            await userService.delete(user.id)
                            toast({
                              description: '删除成功'
                            })
                            fetchUsers()
                          } catch (error) {
                            console.error('删除失败:', error)
                            toast({
                              variant: 'destructive',
                              description: '删除失败'
                            })
                          }
                        }}
                      >
                        删除
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {total > pagination.pageSize && (
        <div className="flex items-center justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => pagination.setPagination({ pageIndex: Math.max(0, pagination.pageIndex - 1) })}
                  disabled={pagination.pageIndex === 0}
                />
              </PaginationItem>
              {Array.from({ length: Math.ceil(total / pagination.pageSize) }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => pagination.setPagination({ pageIndex: page - 1 })}
                    isActive={pagination.pageIndex === page - 1}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => pagination.setPagination({ pageIndex: Math.min(Math.ceil(total / pagination.pageSize) - 1, pagination.pageIndex + 1) })}
                  disabled={pagination.pageIndex === Math.ceil(total / pagination.pageSize) - 1}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <AlertDialog />
    </div>
  )
} 