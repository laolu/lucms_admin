'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
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
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, EyeOff, ArrowUpDown } from "lucide-react"
import { toast } from "sonner"
import { friendLinkService, type FriendLink } from '@/services/friend-link'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default function FriendLinksPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [links, setLinks] = React.useState<FriendLink[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [selectedLink, setSelectedLink] = React.useState<FriendLink | null>(null)

  // 加载数据
  const loadData = React.useCallback(async () => {
    try {
      setLoading(true)
      const data = await friendLinkService.getAll()
      setLinks(data)
    } catch (error) {
      toast.error("加载数据失败")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadData()
  }, [loadData])

  // 处理编辑
  const handleEdit = (link: FriendLink) => {
    router.push(`/admin/friend-links/${link.id}/edit`)
  }

  // 处理删除
  const handleDelete = async () => {
    if (!selectedLink) return
    try {
      await friendLinkService.remove(selectedLink.id)
      toast.success("删除成功")
      setDeleteDialogOpen(false)
      loadData()
    } catch (error) {
      toast.error("删除失败")
    }
  }

  // 处理显示状态切换
  const handleToggleStatus = async (link: FriendLink) => {
    try {
      await friendLinkService.toggleVisible(link.id)
      toast.success("状态更新成功")
      loadData()
    } catch (error) {
      toast.error("状态更新失败")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">友情链接</h1>
        <Button asChild>
          <Link href="/admin/friend-links/create">
            <Plus className="mr-2 h-4 w-4" />
            新建
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索链接..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
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
              <TableHead>链接</TableHead>
              <TableHead>描述</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>
                <Button variant="ghost" className="h-8 p-0">
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
            ) : !links?.length ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              links.map((link) => (
                <TableRow key={link.id}>
                  <TableCell>{link.sort}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      {link.logo && (
                        <img src={link.logo} alt={link.name} className="h-6 w-6 rounded" />
                      )}
                      <span>{link.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {link.url}
                    </a>
                  </TableCell>
                  <TableCell>{link.description}</TableCell>
                  <TableCell>
                    <Badge variant={link.visible ? "default" : "secondary"}>
                      {link.visible ? "显示" : "隐藏"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(link.createdAt)}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEdit(link)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(link)}>
                          {link.visible ? (
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
                          onClick={() => {
                            setSelectedLink(link)
                            setDeleteDialogOpen(true)
                          }}
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
              确定要删除友情链接 "{selectedLink?.name}" 吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 