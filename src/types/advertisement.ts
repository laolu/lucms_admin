export type AdType = 'single' | 'carousel' | 'multiple';

export type AdPosition = 'HOME_CAROUSEL' | 'HOME_BANNER' | 'SIDEBAR' | 'CONTENT_TOP' | 'CONTENT_BOTTOM';

export interface AdImage {
  url: string;
  title?: string;
  link?: string;
}

export interface Advertisement {
  id: number;
  title: string;
  type: AdType;
  images: AdImage[];
  position: AdPosition;
  sort: number;
  isVisible: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdCreateInput {
  title: string;
  type: AdType;
  images: AdImage[];
  position: AdPosition;
  sort: number;
  isVisible: boolean;
  startDate?: string;
  endDate?: string;
}

export interface AdUpdateInput extends AdCreateInput {
  id: number;
}

export interface AdQuery {
  page?: number;
  pageSize?: number;
  position?: AdPosition;
  isVisible?: boolean;
  search?: string;
}

export interface AdListResponse {
  items: Advertisement[];
  total: number;
  page: number;
  pageSize: number;
}

export const AD_POSITIONS = [
  { label: '首页轮播', value: 'HOME_CAROUSEL' },
  { label: '首页横幅', value: 'HOME_BANNER' },
  { label: '侧边栏', value: 'SIDEBAR' },
  { label: '内容顶部', value: 'CONTENT_TOP' },
  { label: '内容底部', value: 'CONTENT_BOTTOM' },
] as const; 