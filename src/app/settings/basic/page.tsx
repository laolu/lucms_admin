'use client'

import * as React from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from '@/components/ui/checkbox'
import { RotateCw } from 'lucide-react'
import { settingService, type SystemConfig } from '@/services/setting'

export default function BasicSettingsPage() {
  const { toast } = useToast()
  const [configs, setConfigs] = React.useState<SystemConfig[]>([])
  const [loading, setLoading] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  // 获取配置
  const fetchConfigs = async () => {
    try {
      setLoading(true)
      const basicConfigs = await settingService.getBasicConfigs()
      setConfigs(basicConfigs)
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
      setSaving(true)
      await settingService.updateConfig(key, value)
      
      // 如果是启用/禁用服务，给出特定提示
      if (key.includes('.enabled')) {
        const serviceName = key.split('.')[1]
        const serviceNames: { [key: string]: string } = {
          email: '邮件服务',
          sms: '短信服务'
        }
        const isEnabled = value === 'true'
        toast({
          title: "成功",
          description: `${serviceNames[serviceName] || '服务'}已${isEnabled ? '启用' : '停用'}`
        })
      } 
      // 如果是切换服务商，给出特定提示
      else if (key.includes('.provider')) {
        const [_, service] = key.split('.')
        const serviceNames: { [key: string]: string } = {
          email: '邮件',
          sms: '短信',
          storage: '存储'
        }
        const providerNames: { [key: string]: { [key: string]: string } } = {
          email: {
            smtp: 'SMTP',
            aliyun: '阿里云',
            tencent: '腾讯云'
          },
          sms: {
            aliyun: '阿里云',
            tencent: '腾讯云'
          },
          storage: {
            local: '本地存储',
            aliyun: '阿里云OSS',
            tencent: '腾讯云COS',
            qiniu: '七牛云存储'
          }
        }
        const serviceName = serviceNames[service] || ''
        const providerName = providerNames[service]?.[value]
        if (!providerName) {
          toast({
            title: "成功",
            description: "服务商切换成功"
          })
          return
        }
        toast({
          title: "成功",
          description: `已将${serviceName}服务切换为${providerName}`
        })
      }
      // 如果是多选服务商，给出特定提示
      else if (key.includes('.providers')) {
        const serviceName = key.split('.')[1]
        const serviceNames: { [key: string]: string } = {
          payment: '支付',
          oauth: '第三方登录'
        }
        const providers = JSON.parse(value)
        const hasProviders = providers.length > 0
        toast({
          title: "成功",
          description: hasProviders 
            ? `${serviceNames[serviceName] || ''}服务商设置已保存`
            : `已停用所有${serviceNames[serviceName] || ''}服务商`
        })
      }
      // 其他配置项的通用提示
      else {
        toast({
          title: "成功",
          description: "保存成功"
        })
      }

      // 重新获取配置，确保数据同步
      await fetchConfigs()
    } catch (error) {
      console.error('保存配置失败:', error)
      
      // 根据配置类型给出具体的错误提示
      if (key.includes('.enabled')) {
        toast({
          variant: "destructive",
          title: "错误",
          description: "服务状态切换失败，请重试"
        })
      } else if (key.includes('.provider')) {
        toast({
          variant: "destructive",
          title: "错误",
          description: "服务商切换失败，请重试"
        })
      } else if (key.includes('.providers')) {
        toast({
          variant: "destructive",
          title: "错误",
          description: "服务商设置保存失败，请重试"
        })
      } else {
        toast({
          variant: "destructive",
          title: "错误",
          description: "保存失败，请重试"
        })
      }
    } finally {
      setSaving(false)
    }
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
          <RadioGroup
            value={config.value}
            onValueChange={(value) => {
              handleChange(value)
              saveConfig(config.key, value)
            }}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id={`${config.key}-true`} />
              <Label htmlFor={`${config.key}-true`}>是</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id={`${config.key}-false`} />
              <Label htmlFor={`${config.key}-false`}>否</Label>
            </div>
          </RadioGroup>
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
      case 'json':
        if (config.key === 'basic.payment.providers' || config.key === 'basic.oauth.providers') {
          const value = JSON.parse(config.value || '[]')
          const options = config.key === 'basic.payment.providers'
            ? [
                { value: 'alipay', label: '支付宝' },
                { value: 'wechat', label: '微信支付', id: 'wechat-pay' }
              ]
            : [
                { value: 'qq', label: 'QQ登录' },
                { value: 'wechat', label: '微信登录', id: 'wechat-login' },
                { value: 'weibo', label: '微博登录' }
              ]

          return (
            <div className="flex flex-wrap gap-4">
              {options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id || option.value}
                    checked={value.includes(option.value)}
                    onCheckedChange={(checked) => {
                      const newValue = checked
                        ? [...value, option.value]
                        : value.filter((v: string) => v !== option.value)
                      handleChange(JSON.stringify(newValue))
                      saveConfig(config.key, JSON.stringify(newValue))
                    }}
                  />
                  <label
                    htmlFor={option.id || option.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          )
        }
        return (
          <Input
            type="text"
            value={config.value}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
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

  // 获取基础配置
  const getBasicConfigs = () => {
    return configs.filter(config => !config.key.includes('.enabled') && !config.key.includes('.provider'))
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">基础设置</h1>
        <Button
          variant="outline"
          onClick={() => fetchConfigs()}
          disabled={loading}
        >
          <RotateCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          刷新
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-6 pt-6">
          {/* 基础配置 */}
          {getBasicConfigs().map((config) => (
            <div key={config.key} className="grid gap-2">
              <Label>{config.description}</Label>
              {renderConfigField(config)}
            </div>
          ))}

          {/* 服务配置 */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-6">服务配置</h2>
            
            <div className="grid gap-6">
              {/* 邮件服务 */}
              <div className="rounded-lg border p-4">
                <h3 className="text-base font-medium mb-4">邮件服务</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>启用邮件服务</Label>
                    <RadioGroup
                      value={configs.find(c => c.key === 'basic.email.enabled')?.value || 'false'}
                      onValueChange={(value) => saveConfig('basic.email.enabled', value)}
                      className="flex gap-4"
                      disabled={saving}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="email-enabled-true" />
                        <Label htmlFor="email-enabled-true">是</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="email-enabled-false" />
                        <Label htmlFor="email-enabled-false">否</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="grid gap-2">
                    <Label>邮件服务商</Label>
                    <RadioGroup
                      value={configs.find(c => c.key === 'basic.email.provider')?.value || 'smtp'}
                      onValueChange={(value) => saveConfig('basic.email.provider', value)}
                      className="flex flex-wrap gap-4"
                      disabled={saving || configs.find(c => c.key === 'basic.email.enabled')?.value !== 'true'}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="smtp" id="email-provider-smtp" />
                        <Label htmlFor="email-provider-smtp">SMTP</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="aliyun" id="email-provider-aliyun" />
                        <Label htmlFor="email-provider-aliyun">阿里云</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="tencent" id="email-provider-tencent" />
                        <Label htmlFor="email-provider-tencent">腾讯云</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* 短信服务 */}
              <div className="rounded-lg border p-4">
                <h3 className="text-base font-medium mb-4">短信服务</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>启用短信服务</Label>
                    <RadioGroup
                      value={configs.find(c => c.key === 'basic.sms.enabled')?.value || 'false'}
                      onValueChange={(value) => saveConfig('basic.sms.enabled', value)}
                      className="flex gap-4"
                      disabled={saving}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="sms-enabled-true" />
                        <Label htmlFor="sms-enabled-true">是</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="sms-enabled-false" />
                        <Label htmlFor="sms-enabled-false">否</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="grid gap-2">
                    <Label>短信服务商</Label>
                    <RadioGroup
                      value={configs.find(c => c.key === 'basic.sms.provider')?.value || 'aliyun'}
                      onValueChange={(value) => saveConfig('basic.sms.provider', value)}
                      className="flex flex-wrap gap-4"
                      disabled={saving || configs.find(c => c.key === 'basic.sms.enabled')?.value !== 'true'}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="aliyun" id="sms-provider-aliyun" />
                        <Label htmlFor="sms-provider-aliyun">阿里云</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="tencent" id="sms-provider-tencent" />
                        <Label htmlFor="sms-provider-tencent">腾讯云</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* 存储服务 */}
              <div className="rounded-lg border p-4">
                <h3 className="text-base font-medium mb-4">存储服务</h3>
                <div className="grid gap-2">
                  <Label>存储服务商</Label>
                  <RadioGroup
                    value={configs.find(c => c.key === 'basic.storage.provider')?.value || 'local'}
                    onValueChange={(value) => saveConfig('basic.storage.provider', value)}
                    className="flex flex-wrap gap-4"
                    disabled={saving}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="local" id="storage-provider-local" />
                      <Label htmlFor="storage-provider-local">本地存储</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="aliyun" id="storage-provider-aliyun" />
                      <Label htmlFor="storage-provider-aliyun">阿里云OSS</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tencent" id="storage-provider-tencent" />
                      <Label htmlFor="storage-provider-tencent">腾讯云COS</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="qiniu" id="storage-provider-qiniu" />
                      <Label htmlFor="storage-provider-qiniu">七牛云存储</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* 支付服务 */}
              <div className="rounded-lg border p-4">
                <h3 className="text-base font-medium mb-4">支付服务</h3>
                <div className="grid gap-2">
                  <Label>支付服务商</Label>
                  <div className={saving ? 'opacity-50 pointer-events-none' : ''}>
                    {renderConfigField({
                      id: 0,
                      key: 'basic.payment.providers',
                      value: configs.find(c => c.key === 'basic.payment.providers')?.value || '[]',
                      type: 'json',
                      description: '支付服务商',
                      sort: 0,
                      isActive: true,
                      createdAt: '',
                      updatedAt: ''
                    })}
                  </div>
                </div>
              </div>

              {/* 第三方登录 */}
              <div className="rounded-lg border p-4">
                <h3 className="text-base font-medium mb-4">第三方登录</h3>
                <div className="grid gap-2">
                  <Label>登录服务商</Label>
                  <div className={saving ? 'opacity-50 pointer-events-none' : ''}>
                    {renderConfigField({
                      id: 0,
                      key: 'basic.oauth.providers',
                      value: configs.find(c => c.key === 'basic.oauth.providers')?.value || '[]',
                      type: 'json',
                      description: '第三方登录服务商',
                      sort: 0,
                      isActive: true,
                      createdAt: '',
                      updatedAt: ''
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 