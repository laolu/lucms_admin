'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "./_components/overview"
import { RecentSales } from "./_components/recent-sales"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { 
  Users, 
  FileText, 
  ShoppingCart, 
  Image, 
  TrendingUp,
  DollarSign,
  CreditCard,
  Activity
} from "lucide-react"

export default function DashboardPage() {
  const [date, setDate] = React.useState<Date>()

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">仪表盘</h2>
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: zhCN }) : <span>选择日期</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                locale={zhCN}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="analytics">分析</TabsTrigger>
          <TabsTrigger value="reports">报告</TabsTrigger>
          <TabsTrigger value="notifications">通知</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  总收入
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">¥45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% 较上月
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  订阅用户
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">
                  +180.1% 较上月
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  内容数量
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12,234</div>
                <p className="text-xs text-muted-foreground">
                  +19% 较上月
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  活跃用户
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">
                  +201 较昨日
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>概览</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>最近销售</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>热门内容</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">深入理解Vue.js实战</p>
                      <p className="text-sm text-muted-foreground">
                        前端开发 / 视频教程
                      </p>
                    </div>
                    <div className="ml-auto font-medium">+¥1,999</div>
                  </div>
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">React Native移动开发</p>
                      <p className="text-sm text-muted-foreground">
                        移动开发 / 实战课程
                      </p>
                    </div>
                    <div className="ml-auto font-medium">+¥1,499</div>
                  </div>
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">Flutter跨平台开发</p>
                      <p className="text-sm text-muted-foreground">
                        移动开发 / 入门教程
                      </p>
                    </div>
                    <div className="ml-auto font-medium">+¥999</div>
                  </div>
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">SpringBoot微服务实战</p>
                      <p className="text-sm text-muted-foreground">
                        后端开发 / 高级教程
                      </p>
                    </div>
                    <div className="ml-auto font-medium">+¥2,999</div>
                  </div>
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">Python数据分析</p>
                      <p className="text-sm text-muted-foreground">
                        数据科学 / 实战课程
                      </p>
                    </div>
                    <div className="ml-auto font-medium">+¥1,299</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>活跃用户</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">张三</p>
                      <p className="text-sm text-muted-foreground">
                        zhang.san@example.com
                      </p>
                    </div>
                    <div className="ml-auto">5次购买</div>
                  </div>
                  <div className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">李四</p>
                      <p className="text-sm text-muted-foreground">
                        li.si@example.com
                      </p>
                    </div>
                    <div className="ml-auto">3次购买</div>
                  </div>
                  <div className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">王五</p>
                      <p className="text-sm text-muted-foreground">
                        wang.wu@example.com
                      </p>
                    </div>
                    <div className="ml-auto">7次购买</div>
                  </div>
                  <div className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">赵六</p>
                      <p className="text-sm text-muted-foreground">
                        zhao.liu@example.com
                      </p>
                    </div>
                    <div className="ml-auto">4次购买</div>
                  </div>
                  <div className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">钱七</p>
                      <p className="text-sm text-muted-foreground">
                        qian.qi@example.com
                      </p>
                    </div>
                    <div className="ml-auto">6次购买</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>数据分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">
                <p>数据分析内容正在开发中...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>统计报告</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">
                <p>统计报告内容正在开发中...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>系统通知</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">
                <p>系统通知内容正在开发中...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 