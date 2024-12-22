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
import { vipLevelService, type VipLevel } from '@/services/vip-level'
import { Switch } from '@/components/ui/switch'
import { formatDateTime } from '@/lib/format'
import { AdminLayout } from '@/components/ui/admin-layout'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

export default function VipLevelsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [vipLevels, setVipLevels] = React.useState<VipLevel[]>([])
  const [loading, setLoading] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [deletingLevel, setDeletingLevel] = React.useState<VipLevel | null>(null)

  const fetchVipLevels = React.useCallback(async () => {
    try {
      setLoading(true)
      const data = await vipLevelService.getAll({
        search: searchQuery
      })
      console.log('VIP等级列表数据:', data)
      setVipLevels(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('获取VIP等级列表失败:', error)
      toast({
        variant: 'destructive',
        description: '获取VIP等级列表失败'
      })
      setVipLevels([])
    } finally {
      setLoading(false)
    }
  }, [searchQuery, toast])

  React.useEffect(() => {
    fetchVipLevels()
  }, [fetchVipLevels])

  const handleDelete = async () => {
    if (!deletingLevel) return

    try {
      await vipLevelService.delete(deletingLevel.id)
      toast({
        description: '删除成功'
      })
      fetchVipLevels()
    } catch (error) {
      console.error('删除失败:', error)
      toast({
        variant: 'destructive',
        description: '删除失败'
      })
    } finally {
      setDeleteDialogOpen(false)
      setDeletingLevel(null)
    }
  }

  return (
    <AdminLayout title="VIP等级管理">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索VIP等级..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-[300px]"
              />
            </div>
          </div>
          <Button onClick={() => router.push('/admin/vip-levels/create')}>
            创建VIP等级
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>等级名称</TableHead>
                <TableHead>等级图标</TableHead>
                <TableHead>价格</TableHead>
                <TableHead>有效期(天)</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    加载中...
                  </TableCell>
                </TableRow>
              ) : vipLevels.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    暂无数据
                  </TableCell>
                </TableRow>
              ) : (
                vipLevels.map((vipLevel) => (
                  <TableRow key={vipLevel.id}>
                    <TableCell>{vipLevel.name}</TableCell>
                    <TableCell>
                      {vipLevel.icon && (
                        <img
                          src={vipLevel.icon}
                          alt={vipLevel.name}
                          className="w-8 h-8"
                        />
                      )}
                    </TableCell>
                    <TableCell>{vipLevel.price}</TableCell>
                    <TableCell>{vipLevel.duration}</TableCell>
                    <TableCell>
                      <Switch
                        checked={vipLevel.isActive}
                        onCheckedChange={async (checked) => {
                          try {
                            await vipLevelService.update(vipLevel.id, { isActive: checked })
                            toast({
                              description: '更新成功'
                            })
                            fetchVipLevels()
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
                    <TableCell>{formatDateTime(vipLevel.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/vip-levels/${vipLevel.id}/edit`)}
                        >
                          编辑
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setDeletingLevel(vipLevel)
                            setDeleteDialogOpen(true)
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

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认删除</AlertDialogTitle>
              <AlertDialogDescription>
                确定要删除这个VIP等级吗？此操作无法撤销。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>确认删除</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  )
} 