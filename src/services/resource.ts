import client from '@/lib/api-client'
import { API_ENDPOINTS } from '@/lib/api-config'

export interface Resource {
  id: number
  title: string
  description: string
  cover: string
  price: number
  originalPrice?: number
  vipPrice: number
  stats: {
    views: number
    downloads: number
    rating: number
    ratingCount: number
    updateTime: string
    likes: number
  }
  author: {
    id: number
    name: string
    avatar: string
    title: string
    description: string
  }
  tags: string[]
  categories: string[]
  features: Array<{
    icon: string
    title: string
    description: string
  }>
  screenshots: Array<{
    url: string
    title: string
  }>
  details: Array<{
    title: string
    items?: Array<{
      label: string
      value: string
    }>
    content?: string[]
  }>
  requirements?: string[]
  installation?: string[]
  downloads: {
    free: {
      name: string
      links: Array<{
        name: string
        url: string
        code: string
      }>
    }
    vip: {
      name: string
      links: Array<{
        name: string
        url: string
        speed: string
      }>
    }
  }
}

export interface ResourceListParams {
  page?: number
  pageSize?: number
  category?: string
  tag?: string
  search?: string
  sort?: 'latest' | 'popular' | 'downloads'
}

export interface ResourceListResponse {
  items: Resource[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface UploadResponse {
  url: string
  path: string
  size: number
  filename: string
  mimetype: string
}

export const resourceService = {
  // 获取资源列表
  getResources: (params?: ResourceListParams) =>
    client.get<ResourceListResponse>(API_ENDPOINTS.RESOURCES, { params }),

  // 获取资源详情
  getResourceDetail: (id: string | number) =>
    client.get<Resource>(API_ENDPOINTS.RESOURCE_DETAIL(id)),

  // 获取分类资源
  getCategoryResources: (categoryId: string | number, params?: ResourceListParams) =>
    client.get<ResourceListResponse>(API_ENDPOINTS.CATEGORY_RESOURCES(categoryId), { params }),

  // 点赞资源
  likeResource: (id: string | number) =>
    client.post(API_ENDPOINTS.RESOURCE_LIKE(id)),

  // 下载资源
  downloadResource: (id: string | number) =>
    client.get(API_ENDPOINTS.RESOURCE_DOWNLOAD(id)),

  // 获取资源评论
  getResourceComments: (id: string | number) =>
    client.get(API_ENDPOINTS.RESOURCE_COMMENTS(id)),

  // 添加评论
  addComment: (resourceId: string | number, content: string) =>
    client.post(API_ENDPOINTS.COMMENT_CREATE, { resourceId, content }),

  // 删除评论
  deleteComment: (commentId: string | number) =>
    client.delete(API_ENDPOINTS.COMMENT_DELETE(commentId)),

  // 搜索资源
  searchResources: (query: string, params?: ResourceListParams) =>
    client.get<ResourceListResponse>(API_ENDPOINTS.SEARCH, {
      params: { ...params, q: query }
    }),

  // 上传图片
  uploadImage: async (file: File, onProgress?: (percent: number) => void): Promise<UploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await client.post<any>(API_ENDPOINTS.UPLOAD_IMAGE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(percent)
        }
      },
    })

    return response.data?.data
  },

  // 检查文件是否为图片
  isImage: (file: File): boolean => {
    return file.type.startsWith('image/')
  },

  // 检查图片大小是否符合限制
  checkImageSize: (file: File, maxSize: number = 5 * 1024 * 1024): boolean => {
    return file.size <= maxSize
  }
} 