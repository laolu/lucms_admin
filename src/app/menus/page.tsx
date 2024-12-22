'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, EyeOff, ArrowUpDown } from "lucide-react"
import { toast } from "sonner"
import { menuService, type Menu } from '@/services/menu'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default function MenusPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [menus, setMenus] = React.useState<Menu[]>([])
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedParentId, setSelectedParentId] = React.useState<string>('all')
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all')
  const [sortBy, setSortBy] = React.useState<string>('sort')
  const [sortOrder, setSortOrder] = React.useState<'ASC' | 'DESC'>('ASC')
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [selectedMenu, setSelectedMenu] = React.useState<Menu | null>(null)

  // 加载菜单列表
  const loadMenus = React.useCallback(async () => {
    try {
      setLoading(true)
      const data = await menuService.getAll({
        search: searchQuery,
        parentId: selectedParentId === 'all' ? undefined : parseInt(selectedParentId),
        visible: selectedStatus === 'all' ? undefined : selectedStatus === 'visible',
        sortBy,
        sort: sortOrder
      })
      setMenus(Array.isArray(data) ? data : [])
    } catch (error) {
      toast.error('加载菜单列表失败')
      setMenus([])
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedParentId, selectedStatus, sortBy, sortOrder])

  React.useEffect(() => {
    loadMenus()
  }, [loadMenus])

  // 处理创建菜单
  const handleCreate = () => {
    router.push('/admin/menus/create')
  }

  // 处理编辑菜单
  const handleEdit = (menu: Menu) => {
    router.push(`/admin/menus/${menu.id}/edit`)
  }

  // 处理删除菜单
  const handleDelete = (menu: Menu) => {
    setSelectedMenu(menu)
    setDeleteDialogOpen(true)
  }

  // 确认删除菜单
  const handleConfirmDelete = async () => {
    if (!selectedMenu) return

    try {
      await menuService.delete(selectedMenu.id)
      toast.success('菜单已删除')
      loadMenus()
    } catch (error) {
      toast.error('删除菜单失败')
    } finally {
      setDeleteDialogOpen(false)
      setSelectedMenu(null)
    }
  }

  // 处理显示/隐藏菜单
  const handleToggleStatus = async (menu: Menu) => {
    try {
      await menuService.updateStatus(menu.id, !menu.visible)
      toast.success(menu.visible ? '菜单已隐藏' : '菜单已显示')
      loadMenus()
    } catch (error) {
      toast.error('操作失败')
    }
  }

  // 处理排序变更
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')
    } else {
      setSortBy(field)
      setSortOrder('ASC')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <Button asChild>
          <Link href="/admin/menus/create">
            <Plus className="mr-2 h-4 w-4" />
            新建
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索菜单..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={selectedParentId}
          onValueChange={setSelectedParentId}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="选择父级" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部</SelectItem>
            <SelectItem value="0">顶级菜单</SelectItem>
            {Array.isArray(menus) && menus
              .filter(menu => !menu.parentId)
              .map(menu => (
                <SelectItem key={menu.id} value={menu.id.toString()}>
                  {menu.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedStatus}
          onValueChange={setSelectedStatus}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="选择状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="visible">显示</SelectItem>
            <SelectItem value="hidden">隐藏</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <Button variant="ghost" className="h-8 p-0" onClick={() => handleSort('sort')}>
                  排序
                  <ArrowUpDown className="w-4 h-4 ml-2" />
                </Button>
              </TableHead>
              <TableHead className="w-[200px]">
                <Button variant="ghost" className="h-8 p-0" onClick={() => handleSort('name')}>
                  名称
                  <ArrowUpDown className="w-4 h-4 ml-2" />
                </Button>
              </TableHead>
              <TableHead>图标</TableHead>
              <TableHead>路径</TableHead>
              <TableHead>父级菜单</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>
                <Button variant="ghost" className="h-8 p-0" onClick={() => handleSort('createdAt')}>
                  创建时间
                  <ArrowUpDown className="w-4 h-4 ml-2" />
                </Button>
              </TableHead>
              <TableHead className="w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  加载中...
                </TableCell>
              </TableRow>
            ) : !menus?.length ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              menus.map((menu) => (
                <TableRow key={menu.id}>
                  <TableCell>{menu.sort}</TableCell>
                  <TableCell className="font-medium">{menu.name}</TableCell>
                  <TableCell>{menu.icon}</TableCell>
                  <TableCell>{menu.path}</TableCell>
                  <TableCell>
                    {menu.parentId ? menus.find(m => m.id === menu.parentId)?.name : '顶级菜单'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={menu.visible ? "default" : "secondary"}>
                      {menu.visible ? '显示' : '隐藏'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(menu.createdAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                          <span className="sr-only">打开菜单</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>操作</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(menu)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(menu)}>
                          {menu.visible ? (
                            <>
                              <EyeOff className="w-4 h-4 mr-2" />
                              隐藏
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 mr-2" />
                              显示
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(menu)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除菜单 "{selectedMenu?.name}" 吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 