'use client';

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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Ban, CheckCircle, ArrowUpDown } from "lucide-react"
import { toast } from "sonner"
import { articleService } from '@/services/article'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default function ArticlesPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [articles, setArticles] = React.useState<any>({
    items: [],
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0
  })
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all')
  const [sortBy, setSortBy] = React.useState<string>('sort')
  const [sortOrder, setSortOrder] = React.useState<'ASC' | 'DESC'>('ASC')
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [selectedArticle, setSelectedArticle] = React.useState<any>(null)
  const [categories, setCategories] = React.useState<any[]>([])

  // 加载文章分类
  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await articleService.getAllCategories()
        setCategories(data || [])
      } catch (error) {
        toast.error('加载分类失败')
      }
    }
    loadCategories()
  }, [])

  // 加载文章列表
  const loadArticles = React.useCallback(async () => {
    try {
      setLoading(true)
      const data = await articleService.getAllArticles()
      setArticles({
        items: data || [],
        total: data?.length || 0,
        page: 1,
        pageSize: 10,
        totalPages: Math.ceil((data?.length || 0) / 10)
      })
    } catch (error) {
      toast.error('加载文章列表失败')
      setArticles({
        items: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0
      })
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedCategory, selectedStatus, sortBy, sortOrder, articles.page])

  React.useEffect(() => {
    loadArticles()
  }, [loadArticles])

  // 处理创建文章
  const handleCreate = () => {
    router.push('/admin/articles/create')
  }

  // 处理编辑文章
  const handleEdit = (article: any) => {
    router.push(`/admin/articles/${article.id}/edit`)
  }

  // 处理删除文章
  const handleDelete = (article: any) => {
    setSelectedArticle(article)
    setDeleteDialogOpen(true)
  }

  // 确认删除文章
  const handleConfirmDelete = async () => {
    if (!selectedArticle) return

    try {
      await articleService.deleteArticle(selectedArticle.id)
      toast.success('文章已删除')
      loadArticles()
    } catch (error) {
      toast.error('删除文章失败')
    } finally {
      setDeleteDialogOpen(false)
      setSelectedArticle(null)
    }
  }

  // 处理显示/隐藏文章
  const handleToggleVisible = async (article: any) => {
    try {
      await articleService.updateArticle(article.id, { isVisible: !article.isVisible })
      toast.success(article.isVisible ? '文章已隐藏' : '文章已显示')
      loadArticles()
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

  // 处理页码变更
  const handlePageChange = (page: number) => {
    setArticles(prev => ({ ...prev, page }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <Button asChild>
          <Link href="/admin/articles/create">
            <Plus className="mr-2 h-4 w-4" />
            新建
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索文章..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部分类</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
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
            <SelectItem value="visible">已显示</SelectItem>
            <SelectItem value="hidden">已隐藏</SelectItem>
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
                <Button variant="ghost" className="h-8 p-0" onClick={() => handleSort('title')}>
                  标题
                  <ArrowUpDown className="w-4 h-4 ml-2" />
                </Button>
              </TableHead>
              <TableHead>分类</TableHead>
              <TableHead>浏览量</TableHead>
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
                <TableCell colSpan={7} className="h-24 text-center">
                  加载中...
                </TableCell>
              </TableRow>
            ) : !articles?.items?.length ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              articles.items.map((article: any) => (
                <TableRow key={article.id}>
                  <TableCell>{article.sort}</TableCell>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell>{article.category?.name}</TableCell>
                  <TableCell>{article.viewCount}</TableCell>
                  <TableCell>
                    <Badge variant={article.isVisible ? "default" : "secondary"}>
                      {article.isVisible ? '已显示' : '已隐藏'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(article.createdAt)}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEdit(article)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleVisible(article)}>
                          {article.isVisible ? (
                            <>
                              <Ban className="w-4 h-4 mr-2" />
                              隐藏
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              显示
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(article)}
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

      {articles.totalPages > 1 && (
        <div className="flex items-center justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(articles.page - 1)}
                  disabled={articles.page === 1}
                />
              </PaginationItem>
              {Array.from({ length: articles.totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={articles.page === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(articles.page + 1)}
                  disabled={articles.page === articles.totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除文章 "{selectedArticle?.title}" 吗？此操作不可撤销。
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