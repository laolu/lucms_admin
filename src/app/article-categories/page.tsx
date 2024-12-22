'use client'

import * as React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, MoreHorizontal, Pencil, Trash2, Ban, CheckCircle, ArrowUpDown } from "lucide-react"
import { toast } from "sonner"
import { articleService } from '@/services/article'
import { formatDate } from '@/lib/utils'

export default function ArticleCategoriesPage() {
  const [loading, setLoading] = React.useState(true)
  const [categories, setCategories] = React.useState<any[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState<any>(null)
  const [formDialogOpen, setFormDialogOpen] = React.useState(false)
  const [formData, setFormData] = React.useState<any>({
    name: '',
    description: '',
    isActive: true,
    sort: 0
  })
  const [saving, setSaving] = React.useState(false)

  // 加载分类列表
  const loadCategories = React.useCallback(async () => {
    try {
      setLoading(true)
      const data = await articleService.getAllCategories()
      setCategories(data || [])
    } catch (error) {
      toast.error('加载分类列表失败')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadCategories()
  }, [loadCategories])

  // 处理创建分类
  const handleCreate = () => {
    setSelectedCategory(null)
    setFormData({
      name: '',
      description: '',
      isActive: true,
      sort: 0
    })
    setFormDialogOpen(true)
  }

  // 处理编辑分类
  const handleEdit = (category: any) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      sort: category.sort
    })
    setFormDialogOpen(true)
  }

  // 处理删除分类
  const handleDelete = (category: any) => {
    setSelectedCategory(category)
    setDeleteDialogOpen(true)
  }

  // 确认删除分类
  const handleConfirmDelete = async () => {
    if (!selectedCategory) return

    try {
      await articleService.deleteCategory(selectedCategory.id)
      toast.success('分类已删除')
      loadCategories()
    } catch (error) {
      toast.error('删除分类失败')
    } finally {
      setDeleteDialogOpen(false)
      setSelectedCategory(null)
    }
  }

  // 处理启用/禁用分类
  const handleToggleActive = async (category: any) => {
    try {
      await articleService.updateCategory(category.id, { isActive: !category.isActive })
      toast.success(category.isActive ? '分类已禁用' : '分类已启用')
      loadCategories()
    } catch (error) {
      toast.error('操作失败')
    }
  }

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setSaving(true)
      if (selectedCategory) {
        await articleService.updateCategory(selectedCategory.id, formData)
        toast.success('分类已更新')
      } else {
        await articleService.createCategory(formData)
        toast.success('分类已创建')
      }
      setFormDialogOpen(false)
      loadCategories()
    } catch (error) {
      toast.error(selectedCategory ? '更新分类失败' : '创建分类失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">分类管理</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          新建
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <Button variant="ghost" className="h-8 p-0">
                  排序
                  <ArrowUpDown className="w-4 h-4 ml-2" />
                </Button>
              </TableHead>
              <TableHead>名称</TableHead>
              <TableHead>描述</TableHead>
              <TableHead>系统分类</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  加载中...
                </TableCell>
              </TableRow>
            ) : !categories?.length ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.sort}</TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <Badge variant={category.isSystem ? "default" : "secondary"}>
                      {category.isSystem ? '是' : '否'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={category.isActive ? "default" : "secondary"}>
                      {category.isActive ? '已启用' : '已禁用'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(category.createdAt)}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEdit(category)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          编辑
                        </DropdownMenuItem>
                        {!category.isSystem && (
                          <>
                            <DropdownMenuItem onClick={() => handleToggleActive(category)}>
                              {category.isActive ? (
                                <>
                                  <Ban className="w-4 h-4 mr-2" />
                                  禁用
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  启用
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(category)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              删除
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCategory ? '编辑分类' : '新建分类'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">名称</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">描述</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort">排序</Label>
              <Input
                id="sort"
                type="number"
                value={formData.sort}
                onChange={(e) => setFormData({ ...formData, sort: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">启用分类</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormDialogOpen(false)}
              >
                取消
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? '保存中...' : (selectedCategory ? '更新' : '创建')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除分类 "{selectedCategory?.name}" 吗？此操作不可撤销。
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