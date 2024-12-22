'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, ArrowUpDown, Download, Heart, Share2, Bookmark, Filter, ArrowDownUp } from "lucide-react"
import { toast } from "sonner"
import { contentService } from '@/services/content'
import { contentCategoryService } from '@/services/content-category'
import { formatDate, cn } from '@/lib/utils'
import Link from 'next/link'

// 排序选项
const SORT_OPTIONS = [
  { label: '创建时间', value: 'createdAt' },
  { label: '更新时间', value: 'updatedAt' },
  { label: '浏览量', value: 'viewCount' },
  { label: '点赞数', value: 'likeCount' },
  { label: '收藏数', value: 'favoriteCount' },
  { label: '分享数', value: 'shareCount' },
  { label: '价格', value: 'price' },
  { label: '排序值', value: 'sort' },
] as const

export default function ContentsPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [contents, setContents] = React.useState<any>({
    items: [],
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0
  })
  const [categories, setCategories] = React.useState<any[]>([])
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all')
  const [selectedPriceType, setSelectedPriceType] = React.useState<string>('all')
  const [sortBy, setSortBy] = React.useState<string>('createdAt')
  const [sortOrder, setSortOrder] = React.useState<'ASC' | 'DESC'>('DESC')
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [deletingContent, setDeletingContent] = React.useState<any>(null)
  const [selectedItems, setSelectedItems] = React.useState<number[]>([])

  // 加载内容列表
  const loadContents = React.useCallback(async () => {
    try {
      setLoading(true)
      const data = await contentService.getAll({
        search: searchQuery,
        categoryId: selectedCategory === 'all' ? undefined : selectedCategory,
        status: selectedStatus === 'all' ? undefined : selectedStatus,
        priceType: selectedPriceType === 'all' ? undefined : selectedPriceType,
        sortBy,
        sort: sortOrder,
        page: contents.page,
        pageSize: contents.pageSize
      })
      setContents(data)
    } catch (error) {
      toast.error('加载内容列表失败')
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedCategory, selectedStatus, selectedPriceType, sortBy, sortOrder, contents.page, contents.pageSize])

  // 加载分类列表
  const loadCategories = React.useCallback(async () => {
    try {
      const data = await contentCategoryService.getTree()
      setCategories(data)
    } catch (error) {
      toast.error('加载分类列表失败')
    }
  }, [])

  React.useEffect(() => {
    loadCategories()
  }, [loadCategories])

  React.useEffect(() => {
    loadContents()
  }, [loadContents])

  // 处理创建内容
  const handleCreate = () => {
    router.push('/admin/contents/create')
  }

  // 处理编辑内容
  const handleEdit = (content: any) => {
    router.push(`/admin/contents/${content.id}/edit`)
  }

  // 处理删除内容
  const handleDelete = (content: any) => {
    setDeletingContent(content)
    setDeleteDialogOpen(true)
  }

  // 确认删除内容
  const handleConfirmDelete = async () => {
    if (!deletingContent) return

    try {
      await contentService.delete(deletingContent.id)
      toast.success('内容已删除')
      loadContents()
    } catch (error) {
      toast.error('删除内容失败')
    } finally {
      setDeleteDialogOpen(false)
      setDeletingContent(null)
    }
  }

  // 处理排序变更
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')
    } else {
      setSortBy(field)
      setSortOrder('DESC')
    }
  }

  // 处理页码变更
  const handlePageChange = (page: number) => {
    setContents(prev => ({ ...prev, page }))
  }

  // 构建分类选项
  const buildCategoryOptions = (items: any[], level = 0): React.ReactNode[] => {
    return items.flatMap((item) => {
      const prefix = '\u00A0'.repeat(level * 4)
      const options = [
        <SelectItem key={item.id} value={item.id.toString()}>
          {prefix + item.name}
        </SelectItem>
      ]
      
      if (item.children?.length) {
        options.push(...buildCategoryOptions(item.children, level + 1))
      }
      
      return options
    })
  }

  // 格式化价格显示
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(price)
  }

  // 获取价格显示标签
  const getPriceLabel = (content: any) => {
    if (content.isFree) return '免费'
    if (content.isVipFree) return 'VIP免费'
    if (content.vipPrice) return `VIP价: ${formatPrice(content.vipPrice)}`
    return formatPrice(content.price)
  }

  // 获取价格标签样式
  const getPriceBadgeVariant = (content: any): "default" | "secondary" | "destructive" | "outline" => {
    if (content.isFree) return "secondary"
    if (content.isVipFree) return "destructive"
    if (content.vipPrice) return "outline"
    return "default"
  }

  // 处理批量选择
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(contents.items.map((item: any) => item.id))
    } else {
      setSelectedItems([])
    }
  }

  // 处理单个选择
  const handleSelectItem = (checked: boolean, id: number) => {
    if (checked) {
      setSelectedItems([...selectedItems, id])
    } else {
      setSelectedItems(selectedItems.filter(item => item !== id))
    }
  }

  // 处理批量删除
  const handleBatchDelete = () => {
    if (selectedItems.length === 0) {
      toast.error('请先选择要删除的内容')
      return
    }
    setDeletingContent({ title: `${selectedItems.length}个内容` })
    setDeleteDialogOpen(true)
  }

  // 确认批量删除
  const handleConfirmBatchDelete = async () => {
    try {
      await Promise.all(selectedItems.map(id => contentService.delete(id)))
      toast.success('内容已删除')
      setSelectedItems([])
      loadContents()
    } catch (error) {
      toast.error('删除内容失败')
    } finally {
      setDeleteDialogOpen(false)
      setDeletingContent(null)
    }
  }

  // 处理批量发布/取消发布
  const handleBatchToggleStatus = async (status: boolean) => {
    if (selectedItems.length === 0) {
      toast.error('请先选择要操作的内容')
      return
    }
    try {
      await Promise.all(selectedItems.map(id => contentService.update(id, { isActive: status })))
      toast.success(status ? '内容已发布' : '内容已设为草稿')
      setSelectedItems([])
      loadContents()
    } catch (error) {
      toast.error('操作失败')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <Button asChild>
          <Link href="/admin/contents/create">
            <Plus className="mr-2 h-4 w-4" />
            新建
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索内容..."
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
            {buildCategoryOptions(categories)}
          </SelectContent>
        </Select>
        <Select
          value={selectedStatus}
          onValueChange={setSelectedStatus}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="内容状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="active">已发布</SelectItem>
            <SelectItem value="draft">草稿</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={selectedPriceType}
          onValueChange={setSelectedPriceType}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="价格类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部价格</SelectItem>
            <SelectItem value="free">免费</SelectItem>
            <SelectItem value="vip">VIP专享</SelectItem>
            <SelectItem value="paid">付费</SelectItem>
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <ArrowDownUp className="w-4 h-4" />
              {SORT_OPTIONS.find(option => option.value === sortBy)?.label || '排序'}
              {sortOrder === 'DESC' ? '↓' : '↑'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>排序方式</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
              {SORT_OPTIONS.map(option => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={sortOrder} onValueChange={(value: any) => setSortOrder(value)}>
              <DropdownMenuRadioItem value="DESC">降序</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="ASC">升序</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedItems.length === contents.items.length && contents.items.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-[400px]">内容信息</TableHead>
              <TableHead>分类</TableHead>
              <TableHead>价格</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>数据统计</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contents.items.map((content: any) => (
              <TableRow key={content.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedItems.includes(content.id)}
                    onCheckedChange={(checked) => handleSelectItem(checked, content.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-3 items-start">
                    {content.thumbnail && (
                      <div className="overflow-hidden relative w-16 h-16 rounded-lg">
                        <Image
                          src={content.thumbnail}
                          alt={content.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{content.title}</div>
                      {content.description && (
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {content.description}
                        </div>
                      )}
                      {content.downloadUrl && (
                        <div className="mt-1">
                          <Badge variant="outline" className="text-xs">
                            <Download className="mr-1 w-3 h-3" />
                            可下载
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {content.category.name}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getPriceBadgeVariant(content)}>
                    {getPriceLabel(content)}
                  </Badge>
                  {content.originalPrice && (
                    <div className="mt-1 text-sm line-through text-muted-foreground">
                      {formatPrice(content.originalPrice)}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={content.isActive ? "default" : "secondary"}>
                    {content.isActive ? '已发布' : '草稿'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-3 items-center text-sm">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex gap-1 items-center">
                            <Eye className="w-4 h-4" />
                            {content.viewCount}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>浏览量</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex gap-1 items-center">
                            <Heart className="w-4 h-4" />
                            {content.likeCount}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>点赞数</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex gap-1 items-center">
                            <Bookmark className="w-4 h-4" />
                            {content.favoriteCount}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>收藏数</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex gap-1 items-center">
                            <Share2 className="w-4 h-4" />
                            {content.shareCount}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>分享数</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
                <TableCell>{formatDate(content.createdAt)}</TableCell>
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
                      <DropdownMenuItem onClick={() => window.open(`/contents/${content.id}`)}>
                        <Eye className="mr-2 w-4 h-4" />
                        查看
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(content)}>
                        <Pencil className="mr-2 w-4 h-4" />
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(content)}
                      >
                        <Trash2 className="mr-2 w-4 h-4" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {contents.totalPages > 1 && (
        <div className="flex justify-center items-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(contents.page - 1)}
                  disabled={contents.page === 1}
                />
              </PaginationItem>
              {Array.from({ length: contents.totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={contents.page === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(contents.page + 1)}
                  disabled={contents.page === contents.totalPages}
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
              确定要删除内容 "{deletingContent?.title}" 吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={selectedItems.length > 0 ? handleConfirmBatchDelete : handleConfirmDelete}>
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 