import client from '@/lib/api-client'
import { API_ENDPOINTS } from '@/lib/api-config'

export interface Content {
  id: number
  title: string
  content: string
  categoryId: number
  category: {
    id: number
    name: string
  }
  isActive: boolean
  viewCount: number
  commentCount: number
  sort: number
  createdAt: string
  updatedAt: string
  attributeValues: Array<{
    id: number
    attributeId: number
    valueId: number
    attribute: {
      id: number
      name: string
    }
    value: {
      id: number
      value: string
    }
  }>
}

export interface ContentCreateInput {
  title: string;
  content: string;
  categoryId: number;
  description?: string;
  isActive?: boolean;
  sort?: number;
  thumbnail?: string;
  images?: string[];
  coverImage?: string;
  bannerImage?: string;
  price?: number;
  originalPrice?: number;
  isFree?: boolean;
  isVipFree?: boolean;
  vipPrice?: number;
  downloadUrl?: string;
  downloadPassword?: string;
  extractPassword?: string;
  tags?: string[];
  meta?: Record<string, any>;
  source?: string;
  author?: string;
  publishedAt?: string | null;
  attributeValueIds: number[];
}

export interface ContentUpdateInput extends Partial<ContentCreateInput> {
  id: number
}

export interface ContentQuery {
  search?: string
  categoryId?: string
  isActive?: boolean
  sort?: 'ASC' | 'DESC'
  sortBy?: string
  page?: number
  pageSize?: number
}

export interface ContentListResponse {
  items: Content[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

interface ApiResponse<T> {
  data: T
  code: number
  message: string
  timestamp: string
}

export const contentService = {
  // 获取内容列表
  getAll: async (query: ContentQuery = {}) => {
    try {
      const response = await client.get<ApiResponse<ContentListResponse>>(API_ENDPOINTS.CONTENTS, { params: query })
      return response.data?.data || { items: [], total: 0, page: 1, pageSize: 10, totalPages: 0 }
    } catch (error) {
      console.error('获取内容列表失败:', error)
      return { items: [], total: 0, page: 1, pageSize: 10, totalPages: 0 }
    }
  },

  // 获取内容详情
  getById: async (id: number) => {
    const response = await client.get<ApiResponse<Content>>(API_ENDPOINTS.CONTENT_DETAIL(id))
    return response.data?.data
  },

  // 创建内容
  create: async (data: ContentCreateInput) => {
    try {
      console.log('发送创建请求，数据:', data);  // 添加日志
      const response = await client.post<ApiResponse<Content>>(
        API_ENDPOINTS.CONTENTS,
        data
      );
      console.log('创建请求响应:', response.data);  // 添加日志
      if (!response.data?.data) {
        throw new Error('创建内容失败: 服务器未返回数据');
      }
      return response.data.data;
    } catch (error) {
      console.error('创建内容失败:', error);
      throw error;
    }
  },

  // 更新内容
  update: async (input: ContentUpdateInput) => {
    const { id, ...updateData } = input;
    const response = await client.put<ApiResponse<Content>>(API_ENDPOINTS.CONTENT_DETAIL(id), updateData)
    return response.data?.data
  },

  // 删除内容
  delete: async (id: number) => {
    await client.delete(API_ENDPOINTS.CONTENT_DETAIL(id))
  },

  // 更新内容排序
  updateSort: async (id: number, sort: number) => {
    const response = await client.patch<ApiResponse<Content>>(API_ENDPOINTS.CONTENT_DETAIL(id), { sort })
    return response.data?.data
  },

  // 更新内容状态
  updateStatus: async (id: number, isActive: boolean) => {
    const response = await client.patch<ApiResponse<Content>>(API_ENDPOINTS.CONTENT_DETAIL(id), { isActive })
    return response.data?.data
  },

  // 增加浏览量
  view: async (id: number) => {
    await client.post(API_ENDPOINTS.CONTENT_VIEW(id))
  },

  // 获取内容的属性值关联
  async getAttributeValues(id: number) {
    try {
      const response = await client.get<ApiResponse<any[]>>(API_ENDPOINTS.CONTENT_ATTRIBUTE_VALUES(id));
      return response.data?.data || [];
    } catch (error) {
      console.error('获取内容属性值关联失败:', error);
      throw error;
    }
  }
} 