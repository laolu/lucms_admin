import client from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-config';
import { AttributeType } from './content-attribute';

export interface ContentModelAttributeValue {
  id: number;
  value: string;
  sort: number;
  isActive: boolean;
}

export interface ContentModelAttribute {
  modelId: number;
  attributeId: number;
  name: string;
  type: AttributeType;
  values: ContentModelAttributeValue[];
  sort: number;
  isEnabled: boolean;
}

export interface ContentModel {
  id: number;
  name: string;
  description: string;
  attributes: ContentModelAttribute[];
  sort: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContentCategory {
  id: number;
  name: string;
  description: string;
  parentId: number;
  modelId: number | null;
  sort: number;
  isActive: boolean;
  model?: ContentModel;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  data: T;
  code: number;
  message: string;
  timestamp: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  parentId?: number | null;
  modelId?: number | null;
  sort?: number;
  isActive?: boolean;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {
  id: number;
}

export const contentCategoryService = {
  // 获取分类树
  getTree: async () => {
    try {
      const response = await client.get<ApiResponse<ContentCategory[]>>(API_ENDPOINTS.CONTENT_CATEGORIES_TREE);
      if (!response.data?.data || !Array.isArray(response.data.data)) {
        return [];
      }
      return response.data.data;
    } catch (error) {
      console.error('获取分类树失败:', error);
      return [];
    }
  },

  // 获取所有分类（平铺结构）
  getAll: async () => {
    try {
      const response = await client.get<ApiResponse<ContentCategory[]>>(API_ENDPOINTS.CONTENT_CATEGORIES);
      return response.data?.data || [];
    } catch (error) {
      console.error('获取分类列表失败:', error);
      return [];
    }
  },

  // 获取单个分类
  getById: async (id: number) => {
    const response = await client.get<ApiResponse<ContentCategory>>(API_ENDPOINTS.CONTENT_CATEGORY_DETAIL(id));
    return response.data?.data;
  },

  // 创建分类
  create: async (data: CreateCategoryDto) => {
    try {
      const response = await client.post<ApiResponse<ContentCategory>>(
        API_ENDPOINTS.CONTENT_CATEGORIES,
        data
      )
      return response.data?.data
    } catch (error) {
      console.error('创建分类失败:', error)
      throw error
    }
  },

  // 更新分类
  update: async (id: number, data: Partial<CreateCategoryDto>) => {
    try {
      // 确保 parentId 不为 null
      if (data.parentId === null || data.parentId === undefined) {
        data.parentId = 0;
      }

      const response = await client.put<ApiResponse<ContentCategory>>(
        API_ENDPOINTS.CONTENT_CATEGORY_DETAIL(id),
        data
      )
      return response.data?.data
    } catch (error) {
      console.error('更新分类失败:', error)
      throw error
    }
  },

  // 删除分类
  remove: async (id: number) => {
    await client.delete(API_ENDPOINTS.CONTENT_CATEGORY_DETAIL(id));
  },

  // 更新分类排序
  updateSort: async (id: number, sort: number) => {
    const response = await client.patch<ApiResponse<ContentCategory>>(
      API_ENDPOINTS.CONTENT_CATEGORY_SORT(id), 
      { targetSort: sort }
    );
    return response.data?.data;
  },

  // 更新分类状态
  updateStatus: async (id: number, isActive: boolean) => {
    const response = await client.patch<ApiResponse<ContentCategory>>(API_ENDPOINTS.CONTENT_CATEGORY_STATUS(id), { isActive });
    return response.data?.data;
  },

  // 移动分类（更改级）
  move: async (id: number, parentId: number | null) => {
    const response = await client.patch<ApiResponse<ContentCategory>>(
      API_ENDPOINTS.CONTENT_CATEGORY_MOVE(id), 
      { parentId: parentId || 0 }
    );
    return response.data?.data;
  },

  // 获取所有属性
  getAllAttributes: async () => {
    try {
      const response = await client.get<ApiResponse<any[]>>(API_ENDPOINTS.CONTENT_ATTRIBUTES);
      return response.data?.data || [];
    } catch (error) {
      console.error('获取属性列表失败:', error);
      return [];
    }
  },

  async getContentTree() {
    try {
      const response = await client.get<ApiResponse<ContentCategory[]>>(API_ENDPOINTS.CONTENT_CATEGORIES_CONTENT_TREE);
      return response.data?.data || [];
    } catch (error) {
      console.error('获取内容分类树失败:', error);
      throw error;
    }
  },
}; 