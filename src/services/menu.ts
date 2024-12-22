import client from '@/lib/api-client'
import { API_ENDPOINTS } from '@/lib/api-config'

export interface Menu {
  id: number
  name: string
  icon?: string
  path?: string
  visible: boolean
  sort: number
  parentId?: number
  createdAt: string
  updatedAt: string
}

export interface MenuCreateInput {
  name: string
  icon?: string
  path?: string
  visible?: boolean
  sort?: number
  parentId?: number
}

export interface MenuUpdateInput extends Partial<MenuCreateInput> {
  id: number
}

export interface MenuQuery {
  search?: string
  parentId?: number
  visible?: boolean
  sortBy?: string
  sort?: 'ASC' | 'DESC'
}

export const menuService = {
  // 获取菜单列表
  getAll: async (query: MenuQuery = {}): Promise<Menu[]> => {
    const response = await client.get<Menu[]>(API_ENDPOINTS.MENUS, { params: query })
    return response.data
  },

  // 获取菜单树
  getTree: async (): Promise<Menu[]> => {
    const response = await client.get<Menu[]>(API_ENDPOINTS.MENUS_TREE)
    return response.data
  },

  // 获取单个菜单
  getById: async (id: number): Promise<Menu> => {
    const response = await client.get<Menu>(API_ENDPOINTS.MENU_DETAIL(id))
    return response.data
  },

  // 创建菜单
  create: async (input: MenuCreateInput): Promise<Menu> => {
    const response = await client.post<Menu>(API_ENDPOINTS.MENUS, input)
    return response.data
  },

  // 更新菜单
  update: async (input: MenuUpdateInput): Promise<Menu> => {
    const response = await client.patch<Menu>(API_ENDPOINTS.MENU_DETAIL(input.id), input)
    return response.data
  },

  // 删除菜单
  delete: async (id: number): Promise<void> => {
    await client.delete(API_ENDPOINTS.MENU_DETAIL(id))
  },

  // 更新菜单状态
  updateStatus: async (id: number, visible: boolean): Promise<Menu> => {
    const response = await client.patch<Menu>(API_ENDPOINTS.MENU_STATUS(id), { visible })
    return response.data
  },

  // 更新菜单排序
  updateSort: async (id: number, sort: number): Promise<Menu> => {
    const response = await client.patch<Menu>(API_ENDPOINTS.MENU_SORT(id), { sort })
    return response.data
  }
} 