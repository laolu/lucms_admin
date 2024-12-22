"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Breadcrumb } from "@/components/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { useTheme } from "./providers"

export function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const { theme } = useTheme()
  
  return (
    <div 
      className="flex min-h-screen w-full"
      data-theme={theme}
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="flex-1 w-0">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <Breadcrumb />
          </div>
          {children}
        </div>
      </SidebarInset>
    </div>
  )
} 