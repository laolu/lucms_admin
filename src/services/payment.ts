import { api } from '@/lib/api-client'
import { API_ENDPOINTS } from '@/lib/api-config'

export type PaymentType = 'alipay' | 'wechat' | 'balance'

export interface CreatePaymentParams {
  type: PaymentType
  amount: number
  resourceId?: number
  planId?: number
  description?: string
}

export interface PaymentResponse {
  id: string
  type: PaymentType
  amount: number
  status: 'pending' | 'success' | 'failed'
  qrcode?: string
  redirectUrl?: string
  createdAt: string
  expireTime: string
}

export const paymentService = {
  // 创建支付订单
  createPayment: (params: CreatePaymentParams) =>
    api.post<PaymentResponse>(API_ENDPOINTS.PAYMENT_CREATE, params),

  // 查询支付状态
  getPaymentStatus: (paymentId: string) =>
    api.get<PaymentResponse>(API_ENDPOINTS.PAYMENT_STATUS(paymentId)),

  // 支付回调处理
  handlePaymentCallback: (params: any) =>
    api.post(API_ENDPOINTS.PAYMENT_CALLBACK, params)
} 