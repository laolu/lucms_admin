"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

interface NavSecondaryProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    title: string
    url: string
    icon: LucideIcon
  }[]
}

export function NavSecondary({ className, items, ...props }: NavSecondaryProps) {
  const pathname = usePathname()

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <SidebarMenu>
        {items?.map((item, index) => {
          const isActive = item.url === pathname
          return (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton 
                asChild
                className={cn(
                  isActive && "bg-accent text-accent-foreground"
                )}
              >
                <Link href={item.url}>
                  <item.icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </div>
  )
} 