import client from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-config';

export interface ContentAttribute {
  id: number;
  attributeId: number;
  attributeName: string;
  type: 'single' | 'multiple';
  isSelected?: boolean;
  values: Array<{
    id: number;
    value: string;
    isSelected?: boolean;
  }>;
}

export interface ContentModel {
  id: number;
  name: string;
  description: string;
  sort: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  attributes: Array<{
    modelId: number;
    attributeId: number;
    attributeName: string;
    attributeType: string;
    values: Array<{
      id: number;
      value: string;
      isChecked: boolean;
    }>;
  }>;
}

export interface UpdateContentModelDto {
  name: string;
  description?: string;
  sort?: number;
  isActive?: boolean;
  attributeIds: number[];
  attributeValues: Array<{
    attributeId: number;
    attributeValueId: number;
  }>;
}

interface ApiResponse<T> {
  data: T;
  code: number;
  message: string;
  timestamp: string;
}

export const contentModelService = {
  getAll: async () => {
    try {
      console.log('开始获取内容模型列表');
      const response = await client.get<ApiResponse<ContentModel[]>>(API_ENDPOINTS.CONTENT_MODELS);
      console.log('获取到的内容模型数据:', response.data);
      return response.data?.data || [];
    } catch (error) {
      console.error('获取内容模型列表失败:', error);
      throw error;
    }
  },

  getById: async (id: number) => {
    try {
      console.log(`开始获取内容模型: ${id}`);
      const response = await client.get<ApiResponse<ContentModel>>(`${API_ENDPOINTS.CONTENT_MODELS}/${id}`);
      console.log('获取到的内容模型数据:', response.data);
      return response.data?.data;
    } catch (error) {
      console.error('获取内容模型失败:', error);
      throw error;
    }
  },

  create: async (data: any) => {
    try {
      console.log('开始创建内容模型:', data);
      const response = await client.post<ApiResponse<ContentModel>>(API_ENDPOINTS.CONTENT_MODELS, data);
      console.log('创建内容模型成功:', response.data);
      return response.data?.data;
    } catch (error) {
      console.error('创建内容模型失败:', error);
      throw error;
    }
  },

  update: async (id: number, data: UpdateContentModelDto) => {
    try {
      console.log(`开始更新内容模型 ${id}:`, data);
      const { id: _, ...updateData } = data;
      const response = await client.put<ApiResponse<ContentModel>>(`${API_ENDPOINTS.CONTENT_MODELS}/${id}`, updateData);
      console.log('更新内容模型成功:', response.data);
      return response.data?.data;
    } catch (error) {
      console.error('更新内容模型失败:', error);
      throw error;
    }
  },

  delete: async (id: number) => {
    try {
      console.log(`开始删除内容模型: ${id}`);
      await client.delete(`${API_ENDPOINTS.CONTENT_MODELS}/${id}`);
      console.log('删除内容模型成功');
    } catch (error) {
      console.error('删除内容模型失败:', error);
      throw error;
    }
  },

  updateStatus: async (id: number, isActive: boolean) => {
    try {
      console.log(`开始更新内容模型状态 ${id}:`, isActive);
      const response = await client.patch<ApiResponse<ContentModel>>(`${API_ENDPOINTS.CONTENT_MODELS}/${id}/status`, { isActive });
      console.log('更新内容模型状态成功:', response.data);
      return response.data?.data;
    } catch (error) {
      console.error('更新内容模型状态失败:', error);
      throw error;
    }
  },

  // 获取模型属性
  getModelAttributes: async (id: number) => {
    try {
      console.log(`开始获取内容模型属性: ${id}`);
      const response = await client.get<ApiResponse<Array<{
        id: number;
        name: string;
        type: string;
        isSelected: boolean;
        values: Array<{
          id: number;
          value: string;
          isSelected: boolean;
        }>;
      }>>>(API_ENDPOINTS.CONTENT_MODEL_ATTRIBUTES(id));
      console.log('获取内容模型属性成功:', response.data);
      return response.data?.data || [];
    } catch (error) {
      console.error('获取内容模型属性失败:', error);
      throw error;
    }
  },

  // 更新模型属性
  updateModelAttributes: async (id: number, attributeIds: number[]) => {
    try {
      console.log(`开始更新内容模型属性 ${id}:`, attributeIds);
      const response = await client.put<ApiResponse<any>>(API_ENDPOINTS.CONTENT_MODEL_ATTRIBUTES(id), { attributeIds });
      console.log('更新内容模型属性成功:', response.data);
      return response.data?.data;
    } catch (error) {
      console.error('更新内容模型属性失败:', error);
      throw error;
    }
  },

  // 获取模型属性值
  getModelAttributeValues: async (id: number) => {
    try {
      console.log(`开始获取内容模型属性值: ${id}`);
      const response = await client.get<ApiResponse<Array<{
        id: number;
        value: string;
        isSelected: boolean;
        attributeId: number;
      }>>>(API_ENDPOINTS.CONTENT_MODEL_ATTRIBUTE_VALUES(id));
      console.log('获取内容模型属性值成功:', response.data);
      return response.data?.data || [];
    } catch (error) {
      console.error('获取内容模型属性值失败:', error);
      throw error;
    }
  },

  // 更新模型属性值
  updateModelAttributeValues: async (id: number, attributeValues: Array<{ attributeId: number; attributeValueId: number }>) => {
    try {
      console.log(`开始更新内容模型属性值 ${id}:`, attributeValues);
      const response = await client.put<ApiResponse<any>>(API_ENDPOINTS.CONTENT_MODEL_ATTRIBUTE_VALUES(id), attributeValues);
      console.log('更新内容模型属性值成功:', response.data);
      return response.data?.data;
    } catch (error) {
      console.error('更新内容模型属性值失败:', error);
      throw error;
    }
  },
}; 