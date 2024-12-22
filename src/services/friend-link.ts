import client from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-config';

export interface FriendLink {
  id: number;
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sort: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  data: T;
  code: number;
  message: string;
  timestamp: string;
}

export interface CreateFriendLinkDto {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sort?: number;
  visible?: boolean;
}

export interface UpdateFriendLinkDto extends Partial<CreateFriendLinkDto> {}

export const friendLinkService = {
  // 获取所有友情链接
  async getAll() {
    try {
      const response = await client.get<ApiResponse<FriendLink[]>>(API_ENDPOINTS.FRIEND_LINKS);
      return response.data?.data || [];
    } catch (error) {
      console.error('获取友情链接列表失败:', error);
      return [];
    }
  },

  // 获取单个友情链接
  async getById(id: number) {
    const response = await client.get<ApiResponse<FriendLink>>(API_ENDPOINTS.FRIEND_LINK_DETAIL(id));
    return response.data?.data;
  },

  // 创建友情链接
  async create(data: CreateFriendLinkDto) {
    try {
      const response = await client.post<ApiResponse<FriendLink>>(
        API_ENDPOINTS.FRIEND_LINKS,
        data
      );
      return response.data?.data;
    } catch (error) {
      console.error('创建友情链接失败:', error);
      throw error;
    }
  },

  // 更新友情链接
  async update(id: number, data: UpdateFriendLinkDto) {
    try {
      const response = await client.put<ApiResponse<FriendLink>>(
        API_ENDPOINTS.FRIEND_LINK_DETAIL(id),
        data
      );
      return response.data?.data;
    } catch (error) {
      console.error('更新友情链接失败:', error);
      throw error;
    }
  },

  // 删除友情链接
  async remove(id: number) {
    await client.delete(API_ENDPOINTS.FRIEND_LINK_DETAIL(id));
  },

  // 切换显示状态
  async toggleVisible(id: number) {
    const response = await client.patch<ApiResponse<FriendLink>>(
      API_ENDPOINTS.FRIEND_LINK_TOGGLE_VISIBLE(id)
    );
    return response.data?.data;
  },

  // 更新排序
  async updateSort(id: number, sort: number) {
    const response = await client.patch<ApiResponse<FriendLink>>(
      API_ENDPOINTS.FRIEND_LINK_SORT(id),
      { sort }
    );
    return response.data?.data;
  },
}; 