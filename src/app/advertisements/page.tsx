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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Ban, CheckCircle, ArrowUpDown } from "lucide-react"
import { toast } from "sonner"
import { advertisementService, type Advertisement, type AdListResponse, type AdPosition } from '@/services/advertisement'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

const AD_POSITIONS: { label: string; value: AdPosition }[] = [
  { label: '首页横幅', value: 'HOME_BANNER' },
  { label: '侧边栏', value: 'SIDEBAR' },
  { label: '内容顶部', value: 'CONTENT_TOP' },
  { label: '内容底部', value: 'CONTENT_BOTTOM' },
  { label: '弹窗广告', value: 'POPUP' },
]

export default function AdvertisementsPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [ads, setAds] = React.useState<AdListResponse>({
    items: [],
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0
  })
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedPosition, setSelectedPosition] = React.useState<string>('all')
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all')
  const [sortBy, setSortBy] = React.useState<string>('order')
  const [sortOrder, setSortOrder] = React.useState<'ASC' | 'DESC'>('ASC')
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [selectedAd, setSelectedAd] = React.useState<Advertisement | null>(null)

  // 加载广告位列表
  const loadAds = React.useCallback(async () => {
    try {
      setLoading(true)
      const data = await advertisementService.getAll({
        search: searchQuery,
        position: selectedPosition === 'all' ? undefined : selectedPosition as AdPosition,
        isActive: selectedStatus === 'all' ? undefined : selectedStatus === 'active',
        sortBy,
        sort: sortOrder,
        page: ads.page,
        pageSize: ads.pageSize
      })
      setAds(data)
    } catch (error) {
      toast.error('加载广告位列表失败')
      setAds({
        items: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0
      })
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedPosition, selectedStatus, sortBy, sortOrder, ads.page, ads.pageSize])

  React.useEffect(() => {
    loadAds()
  }, [loadAds])

  // 处理创建广告位
  const handleCreate = () => {
    router.push('/admin/advertisements/create')
  }

  // 处理编辑广告位
  const handleEdit = (ad: Advertisement) => {
    router.push(`/admin/advertisements/${ad.id}/edit`)
  }

  // 处理删除广告位
  const handleDelete = (ad: Advertisement) => {
    setSelectedAd(ad)
    setDeleteDialogOpen(true)
  }

  // 确认删除广告位
  const handleConfirmDelete = async () => {
    if (!selectedAd) return

    try {
      await advertisementService.delete(selectedAd.id)
      toast.success('广告位已删除')
      loadAds()
    } catch (error) {
      toast.error('删除广告位失败')
    } finally {
      setDeleteDialogOpen(false)
      setSelectedAd(null)
    }
  }

  // 处理启用/禁用广告位
  const handleToggleStatus = async (ad: Advertisement) => {
    try {
      await advertisementService.updateStatus(ad.id, !ad.isActive)
      toast.success(ad.isActive ? '广告位已禁用' : '广告位已启用')
      loadAds()
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
    setAds(prev => ({ ...prev, page }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <Button asChild>
          <Link href="/admin/advertisements/create">
            <Plus className="mr-2 h-4 w-4" />
            新建
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索广告位..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={selectedPosition}
          onValueChange={setSelectedPosition}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="选择位置" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部位置</SelectItem>
            {AD_POSITIONS.map(position => (
              <SelectItem key={position.value} value={position.value}>
                {position.label}
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
            <SelectItem value="active">已启用</SelectItem>
            <SelectItem value="inactive">已禁用</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <Button variant="ghost" className="h-8 p-0" onClick={() => handleSort('order')}>
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
              <TableHead>图片</TableHead>
              <TableHead>链接</TableHead>
              <TableHead>位置</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>有效期</TableHead>
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
                <TableCell colSpan={9} className="h-24 text-center">
                  加载中...
                </TableCell>
              </TableRow>
            ) : !ads?.items?.length ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              ads.items.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell>{ad.order}</TableCell>
                  <TableCell className="font-medium">{ad.title}</TableCell>
                  <TableCell>
                    {ad.imageUrl && (
                      <img
                        src={ad.imageUrl}
                        alt={ad.title}
                        className="w-20 h-12 object-cover rounded"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <a
                      href={ad.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {ad.linkUrl}
                    </a>
                  </TableCell>
                  <TableCell>
                    {AD_POSITIONS.find(p => p.value === ad.position)?.label}
                  </TableCell>
                  <TableCell>
                    <Badge variant={ad.isActive ? "default" : "secondary"}>
                      {ad.isActive ? '已启用' : '已禁用'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {ad.startDate && ad.endDate ? (
                      <span>
                        {formatDate(ad.startDate)} ~ {formatDate(ad.endDate)}
                      </span>
                    ) : '永久'}
                  </TableCell>
                  <TableCell>{formatDate(ad.createdAt)}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEdit(ad)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(ad)}>
                          {ad.isActive ? (
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
                          onClick={() => handleDelete(ad)}
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

      {ads.totalPages > 1 && (
        <div className="flex items-center justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(ads.page - 1)}
                  disabled={ads.page === 1}
                />
              </PaginationItem>
              {Array.from({ length: ads.totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={ads.page === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(ads.page + 1)}
                  disabled={ads.page === ads.totalPages}
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
              确定要删除广告位 "{selectedAd?.title}" 吗？此操作不可撤销。
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