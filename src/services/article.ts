import client from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-config';

export interface ArticleCategory {
  id: number;
  name: string;
  description?: string;
  sort: number;
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  categoryId: number;
  category: ArticleCategory;
  isVisible: boolean;
  isRequired: boolean;
  viewCount: number;
  sort: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  data: T;
  code: number;
  message: string;
  timestamp: string;
}

export const articleService = {
  // 文章分类相关方法
  async getAllCategories() {
    const response = await client.get<ApiResponse<ArticleCategory[]>>(API_ENDPOINTS.ARTICLE_CATEGORIES);
    return response.data?.data;
  },

  async getCategoryById(id: number) {
    const response = await client.get<ApiResponse<ArticleCategory>>(API_ENDPOINTS.ARTICLE_CATEGORY_DETAIL(id));
    return response.data?.data;
  },

  async createCategory(data: Partial<ArticleCategory>) {
    const response = await client.post<ApiResponse<ArticleCategory>>(API_ENDPOINTS.ARTICLE_CATEGORIES, data);
    return response.data?.data;
  },

  async updateCategory(id: number, data: Partial<ArticleCategory>) {
    const response = await client.put<ApiResponse<ArticleCategory>>(API_ENDPOINTS.ARTICLE_CATEGORY_DETAIL(id), data);
    return response.data?.data;
  },

  async deleteCategory(id: number) {
    await client.delete(API_ENDPOINTS.ARTICLE_CATEGORY_DETAIL(id));
  },

  // 文章相关方法
  async getAllArticles() {
    const response = await client.get<ApiResponse<Article[]>>(API_ENDPOINTS.ARTICLES);
    return response.data?.data;
  },

  async getArticleById(id: number) {
    const response = await client.get<ApiResponse<Article>>(API_ENDPOINTS.ARTICLE_DETAIL(id));
    return response.data?.data;
  },

  async getArticlesByCategory(categoryId: number) {
    const response = await client.get<ApiResponse<Article[]>>(API_ENDPOINTS.ARTICLES_BY_CATEGORY(categoryId));
    return response.data?.data;
  },

  async createArticle(data: Partial<Article>) {
    const response = await client.post<ApiResponse<Article>>(API_ENDPOINTS.ARTICLES, data);
    return response.data?.data;
  },

  async updateArticle(id: number, data: Partial<Article>) {
    const response = await client.put<ApiResponse<Article>>(API_ENDPOINTS.ARTICLE_DETAIL(id), data);
    return response.data?.data;
  },

  async deleteArticle(id: number) {
    await client.delete(API_ENDPOINTS.ARTICLE_DETAIL(id));
  },

  async incrementViewCount(id: number) {
    const response = await client.post<ApiResponse<Article>>(API_ENDPOINTS.ARTICLE_INCREMENT_VIEW(id));
    return response.data?.data;
  },
}; 