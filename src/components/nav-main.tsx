"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

interface NavMainProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}

export function NavMain({ className, items, ...props }: NavMainProps) {
  const pathname = usePathname()

  return (
    <SidebarGroup className={className} {...props}>
      <SidebarMenu>
        {items?.map((item) => {
          const isActive = item.url === pathname || 
            item.items?.some(subItem => subItem.url === pathname)

          return (
            <Collapsible key={item.title} asChild defaultOpen={isActive}>
              <SidebarMenuItem className="group/item">
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className={cn(isActive && "bg-accent text-accent-foreground")}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <ChevronRight className="absolute right-2 top-2.5 size-4 transition-transform duration-200 group-data-[state=open]/item:rotate-90" />
                  </>
                ) : (
                  <SidebarMenuButton 
                    asChild 
                    className={cn(isActive && "bg-accent text-accent-foreground")}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
                {item.items?.length && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => {
                        const isSubActive = subItem.url === pathname
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton 
                              asChild
                              className={cn(
                                isSubActive && "bg-accent text-accent-foreground"
                              )}
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
} 