"use client"

import * as React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminLayoutContent } from "./admin-layout-content"

export function AdminContent({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SidebarProvider>
  )
} 