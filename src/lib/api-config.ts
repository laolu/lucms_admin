export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  endpoints: {
    UPLOAD: '/upload',
  },
};

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',

  // User
  USER_INFO: '/user/info',
  USER_UPDATE: '/user/update',

  // VIP
  VIP_LEVELS: '/vip-levels',
  VIP_LEVEL_DETAIL: (id: number) => `/vip-levels/${id}`,
  VIP_LEVEL_STATUS: (id: number) => `/vip-levels/${id}/status`,

  // Content Categories
  CONTENT_CATEGORIES: '/content-categories',
  CONTENT_CATEGORIES_TREE: '/content-categories/tree',
  CONTENT_CATEGORY_DETAIL: (id: number) => `/content-categories/${id}`,
  CONTENT_CATEGORY_SORT: (id: number) => `/content-categories/${id}/sort`,
  CONTENT_CATEGORY_STATUS: (id: number) => `/content-categories/${id}/status`,
  CONTENT_CATEGORY_MOVE: (id: number) => `/content-categories/${id}/move`,
  CONTENT_CATEGORY_ATTRIBUTES: (id: number) => `/content-categories/${id}/attributes`,
  CONTENT_CATEGORY_ATTRIBUTE_VALUES: (id: number) => `/content-categories/${id}/attribute-values`,
  CONTENT_CATEGORIES_CONTENT_TREE: '/content-categories/content-tree',

  // Content Attributes
  CONTENT_ATTRIBUTES: '/content-attributes',
  CONTENT_ATTRIBUTE_DETAIL: (id: number) => `/content-attributes/${id}`,
  CONTENT_ATTRIBUTE_VALUES: (id: number) => `/content-attributes/${id}/values`,
  CONTENT_ATTRIBUTE_STATUS: (id: number) => `/content-attributes/${id}/status`,

  // Contents
  CONTENTS: '/contents',
  CONTENT_DETAIL: (id: number) => `/contents/${id}`,
  CONTENT_VIEW: (id: number) => `/contents/${id}/view`,
  CONTENT_COMMENTS: (id: number) => `/contents/${id}/comments`,
  CONTENT_COMMENT_CREATE: (id: number) => `/contents/${id}/comments`,
  CONTENT_COMMENT_DELETE: (id: number, commentId: number) => `/contents/${id}/comments/${commentId}`,
  CONTENT_LIKE: (id: number) => `/contents/${id}/like`,
  CONTENT_UNLIKE: (id: number) => `/contents/${id}/unlike`,
  CONTENT_FAVORITE: (id: number) => `/contents/${id}/favorite`,
  CONTENT_UNFAVORITE: (id: number) => `/contents/${id}/unfavorite`,
  CONTENT_SHARE: (id: number) => `/contents/${id}/share`,
  CONTENT_REPORT: (id: number) => `/contents/${id}/report`,
  CONTENT_ATTRIBUTE_VALUES: (id: number) => `/contents/${id}/attribute-values`,
  UPLOAD_IMAGE: '/resources/upload/image',

  // Users
  USERS: '/users',
  USER_DETAIL: (id: string) => `/users/${id}`,
  USER_STATUS: (id: number) => `/users/${id}/status`,
  USER_ROLE: (id: number) => `/users/${id}/role`,
  USER_RESET_PASSWORD: (id: number) => `/users/${id}/reset-password`,

  // Orders
  ORDERS: '/orders',
  ORDER_DETAIL: (id: number) => `/orders/${id}`,
  ORDER_CANCEL: (id: number) => `/orders/${id}/cancel`,
  ORDER_REFUND: (id: number) => `/orders/${id}/refund`,
  ORDER_PAY: (id: number) => `/orders/${id}/pay`,

  // Configs
  CONFIGS: '/configs',
  CONFIGS_BASIC: '/configs/basic',
  CONFIGS_EMAIL: '/configs/email',
  CONFIGS_EMAIL_TEST: '/configs/email/test',
  CONFIGS_STORAGE: '/configs/storage',
  CONFIGS_SMS: '/configs/sms',
  CONFIGS_PAYMENT: '/configs/payment',
  CONFIGS_OAUTH: '/api/admin/configs/oauth',
  CONFIGS_SECURITY: '/configs/security',
  CONFIGS_CACHE: '/configs/cache',
  CONFIGS_REFRESH: '/configs/refresh',

  // Advertisements
  ADVERTISEMENTS: '/advertisements',
  ADVERTISEMENT_DETAIL: (id: number) => `/advertisements/${id}`,
  ADVERTISEMENT_STATUS: (id: number) => `/advertisements/${id}/status`,
  ADVERTISEMENT_ORDER: (id: number) => `/advertisements/${id}/order`,

  // Menus
  MENUS: '/menus',
  MENUS_TREE: '/menus/tree',
  MENU_DETAIL: (id: number) => `/menus/${id}`,
  MENU_STATUS: (id: number) => `/menus/${id}/status`,
  MENU_SORT: (id: number) => `/menus/${id}/sort`,

  // 内容模型
  CONTENT_MODELS: '/content-models',
  CONTENT_MODEL_DETAIL: (id: number) => `/content-models/${id}`,
  CONTENT_MODEL_ATTRIBUTES: (id: number) => `/content-models/${id}/attributes`,
  CONTENT_MODEL_ATTRIBUTE_VALUES: (id: number) => `/content-models/${id}/attribute-values`,

  // Friend Links
  FRIEND_LINKS: '/friend-links',
  FRIEND_LINK_DETAIL: (id: number) => `/friend-links/${id}`,
  FRIEND_LINK_TOGGLE_VISIBLE: (id: number) => `/friend-links/${id}/toggle-visible`,
  FRIEND_LINK_SORT: (id: number) => `/friend-links/${id}/sort`,

  // Articles
  ARTICLES: '/api/admin/articles',
  ARTICLE_DETAIL: (id: number) => `/api/admin/articles/${id}`,
  ARTICLE_CATEGORIES: '/api/admin/articles/categories',
  ARTICLE_CATEGORY_DETAIL: (id: number) => `/api/admin/articles/categories/${id}`,
  ARTICLES_BY_CATEGORY: (categoryId: number) => `/api/admin/articles/by-category/${categoryId}`,
  ARTICLE_INCREMENT_VIEW: (id: number) => `/api/admin/articles/${id}/increment-view`,

  // 文件上传
  UPLOAD: '/upload',
} as const; 