import client from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-config';

export enum AttributeType {
  SINGLE = 'single',    // 单选
  MULTIPLE = 'multiple' // 多选
}

export interface AttributeValue {
  id: number;
  value: string;
  sort: number;
  isActive: boolean;
}

export interface ContentAttribute {
  id: number;
  name: string;
  type: AttributeType;
  values: AttributeValue[];
  sort: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAttributeValueDto {
  value: string;
  sort?: number;
  isActive?: boolean;
}

export interface CreateContentAttributeDto {
  name: string;
  type: AttributeType;
  values: CreateAttributeValueDto[];
  sort?: number;
  isActive?: boolean;
}

interface ApiResponse<T> {
  data: T;
  code: number;
  message: string;
  timestamp: string;
}

export const contentAttributeService = {
  // 获取所有属性
  getAll: async () => {
    try {
      const response = await client.get<ApiResponse<ContentAttribute[]>>(API_ENDPOINTS.CONTENT_ATTRIBUTES);
      return response.data?.data || [];
    } catch (error) {
      console.error('获取属性列表失败:', error);
      return [];
    }
  },

  // 获取单个属性
  getById: async (id: number) => {
    const response = await client.get<ApiResponse<ContentAttribute>>(API_ENDPOINTS.CONTENT_ATTRIBUTE_DETAIL(id));
    return response.data?.data;
  },

  // 创建属性
  create: async (dto: CreateContentAttributeDto) => {
    const response = await client.post<ApiResponse<ContentAttribute>>(API_ENDPOINTS.CONTENT_ATTRIBUTES, dto);
    return response.data?.data;
  },

  // 更新属性
  update: async (id: number, dto: Partial<CreateContentAttributeDto>) => {
    const response = await client.patch<ApiResponse<ContentAttribute>>(API_ENDPOINTS.CONTENT_ATTRIBUTE_DETAIL(id), dto);
    return response.data?.data;
  },

  // 删除属性
  delete: async (id: number) => {
    await client.delete(API_ENDPOINTS.CONTENT_ATTRIBUTE_DETAIL(id));
  },

  // 根据分类ID获取属性列表
  getByCategoryId: async (categoryId: number) => {
    try {
      const response = await client.get<ApiResponse<ContentAttribute[]>>(
        API_ENDPOINTS.CONTENT_CATEGORY_ATTRIBUTES(categoryId)
      );
      return response.data?.data || [];
    } catch (error) {
      console.error('获取分类属性失败:', error);
      return [];
    }
  },
}; 