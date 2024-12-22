'use client'

import * as React from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RotateCw, Send } from 'lucide-react'
import { settingService, type SystemConfig } from '@/services/setting'

export default function SettingsPage() {
  const { toast } = useToast()
  const [configs, setConfigs] = React.useState<SystemConfig[]>([])
  const [loading, setLoading] = React.useState(false)
  const [testingEmail, setTestingEmail] = React.useState(false)

  // 获取配置
  const fetchConfigs = async () => {
    try {
      setLoading(true)
      const [
        basicConfigs,
        emailConfigs,
        storageConfigs,
        smsConfigs,
        paymentConfigs,
        oauthConfigs
      ] = await Promise.all([
        settingService.getBasicConfigs(),
        settingService.getEmailConfigs(),
        settingService.getStorageConfigs(),
        settingService.getSmsConfigs(),
        settingService.getPaymentConfigs(),
        settingService.getOauthConfigs()
      ])
      console.log('获取到的配置数据:', {
        basicConfigs,
        emailConfigs,
        storageConfigs,
        smsConfigs,
        paymentConfigs,
        oauthConfigs
      })
      setConfigs([
        ...basicConfigs,
        ...emailConfigs,
        ...storageConfigs,
        ...smsConfigs,
        ...paymentConfigs,
        ...oauthConfigs
      ])
    } catch (error) {
      console.error('获取配置失败:', error)
      toast({
        variant: "destructive",
        title: "错误",
        description: "获取配置失败"
      })
    } finally {
      setLoading(false)
    }
  }

  // 保存配置
  const saveConfig = async (key: string, value: string) => {
    try {
      await settingService.updateConfig(key, value)
      toast({
        title: "成功",
        description: "保存成功"
      })
    } catch (error) {
      console.error('保存配置失败:', error)
      toast({
        variant: "destructive",
        title: "错误",
        description: "保存失败"
      })
    }
  }

  // 测试邮件配置
  const testEmailConfig = async () => {
    try {
      setTestingEmail(true)
      await settingService.testEmailConfig()
      toast({
        title: "成功",
        description: "测试邮件已发送"
      })
    } catch (error) {
      console.error('测试邮件发送失败:', error)
      toast({
        variant: "destructive",
        title: "错误",
        description: "测试邮件发送失败"
      })
    } finally {
      setTestingEmail(false)
    }
  }

  // 获取分组的配置
  const getGroupConfigs = (group: string) => {
    const groupConfigs = configs.filter(config => config.key.startsWith(`${group}.`))
    console.log(`${group} 分组的配置:`, groupConfigs)
    return groupConfigs
  }

  // 渲染配置表单项
  const renderConfigField = (config: SystemConfig) => {
    const handleChange = (value: string) => {
      const newConfigs = configs.map(c => {
        if (c.key === config.key) {
          return { ...c, value }
        }
        return c
      })
      setConfigs(newConfigs)
    }

    const handleBlur = () => {
      saveConfig(config.key, config.value)
    }

    switch (config.type) {
      case 'boolean':
        return (
          <Select
            value={config.value}
            onValueChange={(value) => {
              handleChange(value)
              saveConfig(config.key, value)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">是</SelectItem>
              <SelectItem value="false">否</SelectItem>
            </SelectContent>
          </Select>
        )
      case 'text':
        return (
          <Textarea
            value={config.value}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            rows={3}
          />
        )
      default:
        return (
          <Input
            type="text"
            value={config.value}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
          />
        )
    }
  }

  React.useEffect(() => {
    fetchConfigs()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RotateCw className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">系统设置</h1>
        <Button
          variant="outline"
          onClick={() => fetchConfigs()}
          disabled={loading}
        >
          <RotateCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          刷新
        </Button>
      </div>

      <Tabs defaultValue="basic">
        <TabsList className="mb-4">
          <TabsTrigger value="basic">基础设置</TabsTrigger>
          <TabsTrigger value="email">邮件设置</TabsTrigger>
          <TabsTrigger value="storage">存储设置</TabsTrigger>
          <TabsTrigger value="sms">短信设置</TabsTrigger>
          <TabsTrigger value="payment">支付设置</TabsTrigger>
          <TabsTrigger value="oauth">第三方登录</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">基础设置</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {getGroupConfigs('basic').map((config) => (
                <div key={config.key} className="grid gap-2">
                  <Label>{config.description}</Label>
                  {renderConfigField(config)}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="text-lg font-medium">邮件设置</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={testEmailConfig}
                disabled={testingEmail}
              >
                <Send className={`mr-2 h-4 w-4 ${testingEmail ? 'animate-pulse' : ''}`} />
                发送测试邮件
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {getGroupConfigs('email').map((config) => (
                <div key={config.key} className="grid gap-2">
                  <Label>{config.description}</Label>
                  {renderConfigField(config)}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">存储设置</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {getGroupConfigs('storage').map((config) => (
                <div key={config.key} className="grid gap-2">
                  <Label>{config.description}</Label>
                  {renderConfigField(config)}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sms">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">短信设置</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {getGroupConfigs('sms').map((config) => (
                <div key={config.key} className="grid gap-2">
                  <Label>{config.description}</Label>
                  {renderConfigField(config)}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">支付设置</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {getGroupConfigs('payment').map((config) => (
                <div key={config.key} className="grid gap-2">
                  <Label>{config.description}</Label>
                  {renderConfigField(config)}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="oauth">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">第三方登录</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {getGroupConfigs('oauth').map((config) => (
                <div key={config.key} className="grid gap-2">
                  <Label>{config.description}</Label>
                  {renderConfigField(config)}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 