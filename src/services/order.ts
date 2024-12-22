import client from '@/lib/api-client'
import { API_ENDPOINTS } from '@/lib/api-config'

export interface Order {
  id: number
  orderNo: string
  userId: number
  user: {
    id: number
    username: string
  }
  type: 'content' | 'vip'
  content?: {
    id: number
    title: string
  }
  vipLevel?: {
    id: number
    name: string
  }
  amount: number
  originalAmount?: number
  discountAmount: number
  status: 'pending' | 'paid' | 'cancelled' | 'refunded' | 'expired'
  paymentMethod?: 'alipay' | 'wechat' | 'balance'
  paymentNo?: string
  paymentTime?: string
  cancelTime?: string
  cancelReason?: string
  refundTime?: string
  refundAmount?: number
  refundReason?: string
  createdAt: string
  updatedAt: string
}

export interface OrderQuery {
  page?: number
  pageSize?: number
  status?: Order['status']
  type?: Order['type']
  userId?: number
  startDate?: string
  endDate?: string
}

export interface OrderListResponse {
  items: Order[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

class OrderService {
  async getList(query: OrderQuery = {}): Promise<OrderListResponse> {
    const { data } = await client.get(API_ENDPOINTS.ORDERS, { params: query })
    return data
  }

  async getById(id: number): Promise<Order> {
    const { data } = await client.get(API_ENDPOINTS.ORDER_DETAIL(id))
    return data
  }

  async cancel(id: number, reason: string): Promise<void> {
    await client.post(API_ENDPOINTS.ORDER_CANCEL(id), { reason })
  }

  async refund(id: number, amount: number, reason: string): Promise<void> {
    await client.post(API_ENDPOINTS.ORDER_REFUND(id), { amount, reason })
  }

  async pay(id: number, paymentMethod: Order['paymentMethod']): Promise<void> {
    await client.post(API_ENDPOINTS.ORDER_PAY(id), { paymentMethod })
  }
}

export const orderService = new OrderService() 