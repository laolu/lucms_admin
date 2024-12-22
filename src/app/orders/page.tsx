'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, EyeOff, ArrowUpDown } from "lucide-react"
import { toast } from "sonner"
import { orderService } from '@/services/order'
import { formatDate, formatPrice } from '@/lib/utils'

// 订单类型选项
const ORDER_TYPES = [
  { label: '全部类型', value: 'all' },
  { label: '内容购买', value: 'content' },
  { label: 'VIP购买', value: 'vip' },
]

// 订单状态选项
const ORDER_STATUS = [
  { label: '全部状态', value: 'all' },
  { label: '待支付', value: 'pending' },
  { label: '已支付', value: 'paid' },
  { label: '已取消', value: 'cancelled' },
  { label: '已退款', value: 'refunded' },
  { label: '已过期', value: 'expired' },
]

// 支付方式选项
const PAYMENT_METHODS = [
  { label: '全部方式', value: 'all' },
  { label: '支付宝', value: 'alipay' },
  { label: '微信支付', value: 'wechat' },
  { label: '余额支付', value: 'balance' },
]

// 排序选项
const SORT_OPTIONS = [
  { label: '创建时间', value: 'createdAt' },
  { label: '支付时间', value: 'paymentTime' },
  { label: '订单金额', value: 'amount' },
]

export default function OrdersPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [orders, setOrders] = React.useState<any>({
    items: [],
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0
  })
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedType, setSelectedType] = React.useState('all')
  const [selectedStatus, setSelectedStatus] = React.useState('all')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState('all')
  const [sortBy, setSortBy] = React.useState('createdAt')
  const [sortOrder, setSortOrder] = React.useState<'ASC' | 'DESC'>('DESC')
  const [stats, setStats] = React.useState<any>(null)
  const [actionDialogOpen, setActionDialogOpen] = React.useState(false)
  const [actionOrder, setActionOrder] = React.useState<any>(null)
  const [actionType, setActionType] = React.useState<'cancel' | 'refund' | null>(null)
  const [actionReason, setActionReason] = React.useState('')
  const [refundAmount, setRefundAmount] = React.useState<number>(0)

  // 加载订单列表
  const loadOrders = React.useCallback(async () => {
    try {
      setLoading(true)
      const data = await orderService.getAll({
        search: searchQuery,
        type: selectedType === 'all' ? undefined : selectedType,
        status: selectedStatus === 'all' ? undefined : selectedStatus,
        paymentMethod: selectedPaymentMethod === 'all' ? undefined : selectedPaymentMethod,
        sortBy,
        sort: sortOrder,
        page: orders.page,
        pageSize: orders.pageSize
      })
      setOrders(data)
    } catch (error) {
      toast.error('加载订单列表失败')
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedType, selectedStatus, selectedPaymentMethod, sortBy, sortOrder, orders.page, orders.pageSize])

  // 加载统计信息
  const loadStats = React.useCallback(async () => {
    try {
      const today = new Date()
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1)
      const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      const data = await orderService.getStats(startDate.toISOString(), endDate.toISOString())
      setStats(data)
    } catch (error) {
      toast.error('加载统计信息失败')
    }
  }, [])

  React.useEffect(() => {
    loadOrders()
    loadStats()
  }, [loadOrders, loadStats])

  // 处理页码变更
  const handlePageChange = (page: number) => {
    setOrders(prev => ({ ...prev, page }))
  }

  // 处理订单操作
  const handleAction = (order: any, type: 'cancel' | 'refund') => {
    setActionOrder(order)
    setActionType(type)
    if (type === 'refund') {
      setRefundAmount(order.amount)
    }
    setActionDialogOpen(true)
  }

  // 确认操作
  const handleConfirmAction = async () => {
    if (!actionOrder || !actionType) return

    try {
      if (actionType === 'cancel') {
        await orderService.cancel(actionOrder.id, actionReason)
        toast.success('订单已取消')
      } else if (actionType === 'refund') {
        await orderService.refund(actionOrder.id, refundAmount, actionReason)
        toast.success('退款成功')
      }
      loadOrders()
    } catch (error) {
      toast.error('操作失败')
    } finally {
      setActionDialogOpen(false)
      setActionOrder(null)
      setActionType(null)
      setActionReason('')
      setRefundAmount(0)
    }
  }

  // 获取状态标签样式
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'paid':
        return "default"
      case 'pending':
        return "secondary"
      case 'cancelled':
      case 'refunded':
        return "destructive"
      default:
        return "outline"
    }
  }

  // 获取状态显示文本
  const getStatusText = (status: string): string => {
    const statusMap: Record<string, string> = {
      pending: '待支付',
      paid: '已支付',
      cancelled: '已取消',
      refunded: '已退款',
      expired: '已过期'
    }
    return statusMap[status] || status
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索订单号、用户名..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={selectedType}
          onValueChange={setSelectedType}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="订单类型" />
          </SelectTrigger>
          <SelectContent>
            {ORDER_TYPES.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedStatus}
          onValueChange={setSelectedStatus}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="订单状态" />
          </SelectTrigger>
          <SelectContent>
            {ORDER_STATUS.map(status => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedPaymentMethod}
          onValueChange={setSelectedPaymentMethod}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="支付方式" />
          </SelectTrigger>
          <SelectContent>
            {PAYMENT_METHODS.map(method => (
              <SelectItem key={method.value} value={method.value}>
                {method.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <ArrowUpDown className="w-4 h-4" />
              {SORT_OPTIONS.find(option => option.value === sortBy)?.label || '排序'}
              {sortOrder === 'DESC' ? '↓' : '↑'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>排序方式</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {SORT_OPTIONS.map(option => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => {
                  if (sortBy === option.value) {
                    setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')
                  } else {
                    setSortBy(option.value)
                    setSortOrder('DESC')
                  }
                }}
              >
                {option.label}
                {sortBy === option.value && (sortOrder === 'DESC' ? ' ↓' : ' ↑')}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总订单数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">本月订单总数</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">支付订单数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.paidOrders}</div>
              <p className="text-xs text-muted-foreground">本月已支付订单数</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">交易金额</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.totalAmount)}</div>
              <p className="text-xs text-muted-foreground">本月交易总额</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">下单用户数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">本月下单用户数</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>订单号</TableHead>
              <TableHead>用户</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>商品</TableHead>
              <TableHead>金额</TableHead>
              <TableHead>支付方式</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.items.map((order: any) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.orderNo}</TableCell>
                <TableCell>{order.user.username}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {order.type === 'content' ? '内容购买' : 'VIP购买'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {order.type === 'content' ? order.content?.title : order.vipLevel?.name}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{formatPrice(order.amount)}</div>
                  {order.originalAmount && order.originalAmount > order.amount && (
                    <div className="text-sm text-muted-foreground line-through">
                      {formatPrice(order.originalAmount)}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {order.paymentMethod && (
                    <Badge variant="secondary">
                      {PAYMENT_METHODS.find(m => m.value === order.paymentMethod)?.label}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
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
                      <DropdownMenuItem onClick={() => router.push(`/admin/orders/${order.id}`)}>
                        查看详情
                      </DropdownMenuItem>
                      {order.status === 'pending' && (
                        <DropdownMenuItem onClick={() => handleAction(order, 'cancel')}>
                          取消订单
                        </DropdownMenuItem>
                      )}
                      {order.status === 'paid' && (
                        <DropdownMenuItem onClick={() => handleAction(order, 'refund')}>
                          申请退款
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {orders.totalPages > 1 && (
        <div className="flex items-center justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(orders.page - 1)}
                  disabled={orders.page === 1}
                />
              </PaginationItem>
              {Array.from({ length: orders.totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={orders.page === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(orders.page + 1)}
                  disabled={orders.page === orders.totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <AlertDialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'cancel' ? '取消订单' : '申请退款'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'cancel' 
                ? '确定要取消该订单吗？此操作不可撤销。'
                : '确定要对该订单进行退款吗？此操作不可撤销。'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            {actionType === 'refund' && (
              <div className="grid gap-2">
                <Label htmlFor="refundAmount">退款金额</Label>
                <Input
                  id="refundAmount"
                  type="number"
                  step="0.01"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(parseFloat(e.target.value))}
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="reason">
                {actionType === 'cancel' ? '取消原因' : '退款原因'}
              </Label>
              <Input
                id="reason"
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder={`请输入${actionType === 'cancel' ? '取消' : '退款'}原因`}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>
              确认{actionType === 'cancel' ? '取消' : '退款'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 