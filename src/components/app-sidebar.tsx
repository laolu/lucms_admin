"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Users,
  Box,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "LuCMS",
      logo: GalleryVerticalEnd,
      plan: "企业版",
    },
  ],
  navMain: [
    {
      title: "仪表盘",
      url: "/admin/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "概览",
          url: "/admin/dashboard",
        },
      ],
    },
    {
      title: "运营管理",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "订单管理",
          url: "/admin/orders",
        },
        {
          title: "广告管理",
          url: "/admin/advertisements",
        },
        {
          title: "菜单管理",
          url: "/admin/menus",
        },
        {
          title: "文章管理",
          url: "/admin/articles",
        },
        {
          title: "友情链接",
          url: "/admin/friend-links",
        },
      ],
    },
    {
      title: "内容管理",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "内容分类",
          url: "/admin/content-categories",
        },
        {
          title: "内容列表",
          url: "/admin/contents",
        },
      ],
    },
    {
      title: "会员管理",
      url: "#",
      icon: Users,
      items: [
        {
          title: "会员列表",
          url: "/admin/users",
        },
        {
          title: "会员等级",
          url: "/admin/vip-levels",
        },
      ],
    },
    {
      title: "模型管理",
      url: "/admin/content-models",
      icon: Box,
      items: [
        {
          title: "模型列表",
          url: "/admin/content-models",
        },
        {
          title: "属性管理",
          url: "/admin/content-attributes",
        },
      ],
    },
    {
      title: "系统设置",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "基础设置",
          url: "/admin/settings/basic",
        },
        {
          title: "邮件设置",
          url: "/admin/settings/email",
        },
        {
          title: "存储设置",
          url: "/admin/settings/storage",
        },
        {
          title: "短信设置",
          url: "/admin/settings/sms",
        },
        {
          title: "支付设置",
          url: "/admin/settings/payment",
        },
        {
          title: "第三方登录",
          url: "/admin/settings/oauth",
        },
      ],
    },
  ],
}

interface AppSidebarProps {
  variant?: "sidebar" | "floating" | "inset"
}

export function AppSidebar({ variant = "sidebar" }: AppSidebarProps) {
  return (
    <Sidebar variant={variant}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
} 