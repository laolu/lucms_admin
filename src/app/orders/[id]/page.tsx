'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { orderService } from '@/services/order'
import { formatDate, formatPrice } from '@/lib/utils'

// 订单状态映射
const ORDER_STATUS_MAP = {
  pending: { label: '待支付', variant: 'secondary' },
  paid: { label: '已支付', variant: 'default' },
  cancelled: { label: '已取消', variant: 'destructive' },
  refunded: { label: '已退款', variant: 'destructive' },
  expired: { label: '已过期', variant: 'outline' },
} as const

// 支付方式映射
const PAYMENT_METHOD_MAP = {
  alipay: '支付宝',
  wechat: '微信支付',
  balance: '余额支付',
} as const

// 订单类型映射
const ORDER_TYPE_MAP = {
  content: '内容购买',
  vip: 'VIP购买',
} as const

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [order, setOrder] = React.useState<any>(null)
  const [actionDialogOpen, setActionDialogOpen] = React.useState(false)
  const [actionType, setActionType] = React.useState<'cancel' | 'refund' | null>(null)
  const [actionReason, setActionReason] = React.useState('')
  const [refundAmount, setRefundAmount] = React.useState<number>(0)

  // 加载订单详情
  const loadOrder = React.useCallback(async () => {
    try {
      setLoading(true)
      const data = await orderService.getById(Number(params.id))
      setOrder(data)
      if (actionType === 'refund') {
        setRefundAmount(data.amount)
      }
    } catch (error) {
      toast.error('加载订单详情失败')
    } finally {
      setLoading(false)
    }
  }, [params.id, actionType])

  React.useEffect(() => {
    loadOrder()
  }, [loadOrder])

  // 处理订单操作
  const handleAction = (type: 'cancel' | 'refund') => {
    setActionType(type)
    setActionDialogOpen(true)
  }

  // 确认操作
  const handleConfirmAction = async () => {
    if (!order || !actionType) return

    try {
      if (actionType === 'cancel') {
        await orderService.cancel(order.id, actionReason)
        toast.success('订单已取消')
      } else if (actionType === 'refund') {
        await orderService.refund(order.id, refundAmount, actionReason)
        toast.success('退款成功')
      }
      loadOrder()
    } catch (error) {
      toast.error('操作失败')
    } finally {
      setActionDialogOpen(false)
      setActionType(null)
      setActionReason('')
      setRefundAmount(0)
    }
  }

  if (loading || !order) {
    return <div className="p-8 text-center text-muted-foreground">加载中...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">订单详情</h2>
          <p className="text-sm text-muted-foreground">
            订单号: {order.orderNo}
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            返回
          </Button>
          {order.status === 'pending' && (
            <Button
              variant="destructive"
              onClick={() => handleAction('cancel')}
            >
              取消订单
            </Button>
          )}
          {order.status === 'paid' && (
            <Button
              variant="destructive"
              onClick={() => handleAction('refund')}
            >
              申请退款
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-1 text-sm font-medium text-muted-foreground">订单状态</div>
                <Badge variant={ORDER_STATUS_MAP[order.status]?.variant as any}>
                  {ORDER_STATUS_MAP[order.status]?.label}
                </Badge>
              </div>
              <div>
                <div className="mb-1 text-sm font-medium text-muted-foreground">订单类型</div>
                <Badge variant="outline">
                  {ORDER_TYPE_MAP[order.type]}
                </Badge>
              </div>
              <div>
                <div className="mb-1 text-sm font-medium text-muted-foreground">创建时间</div>
                <div>{formatDate(order.createdAt)}</div>
              </div>
              <div>
                <div className="mb-1 text-sm font-medium text-muted-foreground">更新时间</div>
                <div>{formatDate(order.updatedAt)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>用户信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-1 text-sm font-medium text-muted-foreground">用户ID</div>
                <div>{order.userId}</div>
              </div>
              <div>
                <div className="mb-1 text-sm font-medium text-muted-foreground">用户名</div>
                <div>{order.user.username}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>商品信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <div className="mb-1 text-sm font-medium text-muted-foreground">商品名称</div>
                <div>
                  {order.type === 'content' ? order.content?.title : order.vipLevel?.name}
                </div>
              </div>
              <div>
                <div className="mb-1 text-sm font-medium text-muted-foreground">商品金额</div>
                <div className="flex gap-2 items-center">
                  <div className="text-lg font-medium">{formatPrice(order.amount)}</div>
                  {order.originalAmount && order.originalAmount > order.amount && (
                    <div className="text-sm line-through text-muted-foreground">
                      {formatPrice(order.originalAmount)}
                    </div>
                  )}
                </div>
              </div>
              {order.discountAmount > 0 && (
                <div>
                  <div className="mb-1 text-sm font-medium text-muted-foreground">优惠金额</div>
                  <div className="text-green-600">{formatPrice(order.discountAmount)}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>支付信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {order.paymentMethod && (
                <div>
                  <div className="mb-1 text-sm font-medium text-muted-foreground">支付方式</div>
                  <Badge variant="secondary">
                    {PAYMENT_METHOD_MAP[order.paymentMethod]}
                  </Badge>
                </div>
              )}
              {order.paymentTime && (
                <div>
                  <div className="mb-1 text-sm font-medium text-muted-foreground">支付时间</div>
                  <div>{formatDate(order.paymentTime)}</div>
                </div>
              )}
              {order.paymentNo && (
                <div>
                  <div className="mb-1 text-sm font-medium text-muted-foreground">支付流水号</div>
                  <div>{order.paymentNo}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {(order.status === 'cancelled' || order.status === 'refunded') && (
          <Card>
            <CardHeader>
              <CardTitle>
                {order.status === 'cancelled' ? '取消信息' : '退款信息'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <div className="mb-1 text-sm font-medium text-muted-foreground">
                    {order.status === 'cancelled' ? '取消时间' : '退款时间'}
                  </div>
                  <div>
                    {formatDate(order.status === 'cancelled' ? order.cancelTime : order.refundTime)}
                  </div>
                </div>
                {order.status === 'refunded' && (
                  <div>
                    <div className="mb-1 text-sm font-medium text-muted-foreground">退款金额</div>
                    <div>{formatPrice(order.refundAmount)}</div>
                  </div>
                )}
                <div>
                  <div className="mb-1 text-sm font-medium text-muted-foreground">
                    {order.status === 'cancelled' ? '取消原因' : '退款原因'}
                  </div>
                  <div>
                    {order.status === 'cancelled' ? order.cancelReason : order.refundReason}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

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