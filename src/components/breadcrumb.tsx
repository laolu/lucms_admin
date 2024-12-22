'use client'

import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

// 面包屑映射配置
const breadcrumbMap: { [key: string]: string } = {
  // 主要路径
  'admin': '控制台',
  
  // 系统设置
  'settings': '系统设置',
  'basic': '基础设置',
  'email': '邮件设置',
  'storage': '存储设置',
  'sms': '短信设置',
  'payment': '支付设置',
  'oauth': '第三方登录',
  
  // 运营管理
  'pages': '页面管理',
  'advertisements': '广告管理',
  'menus': '菜单管理',
  'friend-links': '友情链接',
  
  // 内容管理
  'content-categories': '内容分类',
  'content-models': '内容模型',
  'content-attributes': '内容属性',
  'contents': '内容管理',
  
  // 用户管理
  'users': '用户管理',
  'roles': '角色管理',
  'permissions': '权限管理',
  
  // 订单管理
  'orders': '订单管理',
  'refunds': '退款管理',
  'payments': '支付记录',
  
  // 广告管理
  'ad-spaces': '广告位管理',
  
  // 会员管理
  'vip-levels': '会员等级',
  'members': '会员列表',
  
  // 统计分析
  'statistics': '统计分析',
  'dashboard': '仪表盘',
  'reports': '报表管理',
  
  // 系统工具
  'tools': '系统工具',
  'logs': '系统日志',
  'cache': '缓存管理',
  'backup': '备份管理',
  
  // 通用操作
  'create': '创建',
  'edit': '编辑',
  'new': '新建',
  'view': '查看',
  'delete': '删除',
  'list': '列表',
  'detail': '详情',
  '[id]': '详情'
}

export function Breadcrumb() {
  const pathname = usePathname()
  const paths = pathname.split('/').filter(Boolean)
  
  // 生成面包屑项
  const breadcrumbs = paths.map((path, index) => {
    // 处理动态路由参数
    const label = path.startsWith('[') && path.endsWith(']') 
      ? '详情'
      : (breadcrumbMap[path] || path)
    const isLast = index === paths.length - 1
    
    return (
      <div key={path} className="flex items-center">
        {index > 0 && (
          <ChevronRight className="h-4 w-4 mx-2 text-gray-500" />
        )}
        <span className={`${isLast ? 'text-gray-900' : 'text-gray-500'}`}>
          {label}
        </span>
      </div>
    )
  })

  return (
    <div className="flex items-center text-sm">
      {breadcrumbs}
    </div>
  )
} 