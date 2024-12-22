import client from '@/lib/api-client'
import { API_ENDPOINTS } from '@/lib/api-config'

export interface User {
  id: number
  username: string
  email: string
  avatar?: string
  nickname?: string
  isAdmin: boolean
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export interface LoginParams {
  identifier: string // 邮箱/手机号
  password: string
}

export interface RegisterParams {
  email: string
  password: string
  nickname?: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface UpdateUserParams {
  nickname?: string
  avatar?: string
  email?: string
  password?: string
}

export interface ForgotPasswordParams {
  email: string
}

export interface ResetPasswordParams {
  token: string
  password: string
}

export interface SocialLoginParams {
  type: 'wechat' | 'qq'
}

export interface SocialLoginResponse {
  url: string
}

export interface VipPlan {
  id: number
  name: string
  price: number
  duration: number // 天数
  features: string[]
}

// 用户管理相关接口
export interface UserCreateInput {
  username: string
  email: string
  password: string
  isAdmin?: boolean
  isActive?: boolean
}

export interface UserUpdateInput extends Partial<Omit<UserCreateInput, 'password'>> {
  id: number
  password?: string
}

export interface UserQuery {
  search?: string
  status?: string
  sortBy?: string
  sort?: 'ASC' | 'DESC'
  page?: number
  pageSize?: number
}

export interface UserListResponse {
  items: User[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export const userService = {
  // 登录相关
  login: (params: LoginParams) =>
    client.post<LoginResponse>(API_ENDPOINTS.LOGIN, params),

  // 用户信息相关
  getUserInfo: () =>
    client.get<User>(API_ENDPOINTS.USER_INFO),

  updateUser: (params: UpdateUserParams) =>
    client.put<User>(API_ENDPOINTS.USER_UPDATE, params),

  // VIP相关
  getVipPlans: () =>
    client.get<VipPlan[]>(API_ENDPOINTS.VIP_PLANS),

  purchaseVip: (planId: number) =>
    client.post(API_ENDPOINTS.VIP_PURCHASE, { planId }),

  getVipStatus: () =>
    client.get(API_ENDPOINTS.VIP_STATUS),

  // 用户管理相关
  getAll: async (query: UserQuery = {}): Promise<UserListResponse> => {
    const response = await client.get<any>(API_ENDPOINTS.USERS, { params: query })
    return {
      items: response.data?.data || [],
      total: response.data?.data?.length || 0,
      page: 1,
      pageSize: 10,
      totalPages: Math.ceil((response.data?.data?.length || 0) / 10)
    }
  },

  getById: async (id: number): Promise<User> => {
    const response = await client.get<any>(API_ENDPOINTS.USER_DETAIL(id))
    return response.data?.data
  },

  create: async (input: UserCreateInput): Promise<User> => {
    const response = await client.post<any>(API_ENDPOINTS.USERS, input)
    return response.data?.data
  },

  update: async (input: UserUpdateInput): Promise<User> => {
    const response = await client.patch<any>(API_ENDPOINTS.USER_DETAIL(input.id), input)
    return response.data?.data
  },

  delete: async (id: number): Promise<void> => {
    await client.delete(API_ENDPOINTS.USER_DETAIL(id))
  },

  updateStatus: async (id: number, isActive: boolean): Promise<User> => {
    const response = await client.patch<any>(API_ENDPOINTS.USER_STATUS(id), { isActive })
    return response.data?.data
  },

  // 管理员重置用户密码
  adminResetPassword: async (id: number, password: string): Promise<void> => {
    await client.post(API_ENDPOINTS.USER_RESET_PASSWORD(id), { password })
  }
} 