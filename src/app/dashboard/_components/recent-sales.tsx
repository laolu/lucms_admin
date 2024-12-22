'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">张三</p>
          <p className="text-sm text-muted-foreground">
            zhang.san@example.com
          </p>
        </div>
        <div className="ml-auto font-medium">+¥1,999.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="/avatars/02.png" alt="Avatar" />
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">李四</p>
          <p className="text-sm text-muted-foreground">li.si@example.com</p>
        </div>
        <div className="ml-auto font-medium">+¥39.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/03.png" alt="Avatar" />
          <AvatarFallback>WW</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">王五</p>
          <p className="text-sm text-muted-foreground">
            wang.wu@example.com
          </p>
        </div>
        <div className="ml-auto font-medium">+¥299.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/04.png" alt="Avatar" />
          <AvatarFallback>ZL</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">赵六</p>
          <p className="text-sm text-muted-foreground">zhao.liu@example.com</p>
        </div>
        <div className="ml-auto font-medium">+¥99.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/05.png" alt="Avatar" />
          <AvatarFallback>QQ</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">钱七</p>
          <p className="text-sm text-muted-foreground">qian.qi@example.com</p>
        </div>
        <div className="ml-auto font-medium">+¥39.00</div>
      </div>
    </div>
  )
} 