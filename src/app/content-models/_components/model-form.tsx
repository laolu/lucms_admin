'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { contentModelService } from '@/services/content-model';
import { contentAttributeService } from '@/services/content-attribute';
import type { ContentModel, ContentAttribute, UpdateContentModelDto } from '@/services/content-model';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().min(1, '请输入名称'),
  description: z.string().optional(),
  sort: z.number().min(0).default(0),
  isActive: z.boolean().default(true),
});

type FormData = z.infer<typeof formSchema>;

interface ModelFormProps {
  model?: ContentModel;
}

export function ModelForm({ model }: ModelFormProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [attributes, setAttributes] = React.useState<ContentAttribute[]>([]);
  const [selectedAttributeIds, setSelectedAttributeIds] = React.useState<number[]>([]);
  const [selectedValues, setSelectedValues] = React.useState<Map<number, number[]>>(new Map());
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [formData, setFormData] = React.useState<FormData | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: model?.name || '',
      description: model?.description || '',
      sort: model?.sort || 0,
      isActive: model?.isActive ?? true,
    },
  });

  // 加载数据
  const loadData = React.useCallback(async () => {
    try {
      if (model) {
        // 编辑模式：获取模型相关数据
        const modelData = await contentModelService.getById(model.id);
        console.log('modelData:', modelData);
        
        const selectedAttributeIds = await contentModelService.getModelAttributes(model.id);
        console.log('已选择的属性ID:', selectedAttributeIds);
        
        const selectedAttributeValues = await contentModelService.getModelAttributeValues(model.id);
        console.log('已选择的属性值:', selectedAttributeValues);

        if (!modelData?.attributes) {
          console.error('modelData.attributes 不存在');
          return;
        }

        const mergedAttributes = modelData.attributes.map(attr => ({
          id: attr.attributeId,
          attributeId: attr.attributeId,
          attributeName: attr.attributeName,
          type: attr.attributeType as 'single' | 'multiple',
          isSelected: selectedAttributeIds.includes(attr.attributeId),
          values: attr.values.map(value => ({
            id: value.id,
            value: value.value,
            isSelected: selectedAttributeValues.some(av => 
              av.attributeId === attr.attributeId && 
              av.attributeValueId === value.id
            )
          }))
        }));
        
        console.log('最终合并的属性:', mergedAttributes);
        setAttributes(mergedAttributes);
        
        setSelectedAttributeIds(selectedAttributeIds);
        
        const valuesMap = new Map<number, number[]>();
        selectedAttributeValues.forEach(av => {
          const current = valuesMap.get(av.attributeId) || [];
          valuesMap.set(av.attributeId, [...current, av.attributeValueId]);
        });
        setSelectedValues(valuesMap);
      } else {
        // 创建模式：加载所有可用属性
        console.log('创建模式：开始加载所有属性');
        const allAttributes = await contentAttributeService.getAll();
        console.log('获取到的所有属性:', allAttributes);
        
        const formattedAttributes = allAttributes.map(attr => ({
          id: attr.id,
          attributeId: attr.id,
          attributeName: attr.name,
          type: attr.type,
          isSelected: false,
          values: attr.values.map(value => ({
            id: value.id,
            value: value.value,
            isSelected: false
          }))
        }));
        
        console.log('格式化后的属性:', formattedAttributes);
        setAttributes(formattedAttributes);
      }
    } catch (error) {
      console.error('加载数据失败:', error);
      toast.error('加载数据失败');
    }
  }, [model]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleBack = () => {
    if (loading) return;
    router.back();
  };

  const onSubmit = async (data: FormData) => {
    try {
      console.log('onSubmit 函数被调用');
      console.log('表单数据:', data);
      
      setFormData(data);
      setShowConfirmDialog(true);
      console.log('状态已更新:', {
        formData: data,
        showConfirmDialog: true
      });
    } catch (error) {
      console.error('onSubmit 处理出错:', error);
    }
  };

  const handleConfirm = async () => {
    console.log('确认按钮点击，当前状态:', {
      showConfirmDialog,
      formData,
      loading,
      selectedAttributeIds,
      selectedValues
    });
    if (!formData) return;

    try {
      setLoading(true);
      
      // 获取当前显示的属性列表
      const currentAttributes = attributes.filter(attr => attr.isSelected);
      console.log('当前选中的属性:', currentAttributes);
      
      // 只处理当前显示的属性的ID
      const attributeIds = currentAttributes.map(attr => attr.attributeId);
      console.log('要提交的属性ID:', attributeIds);
      
      // 只处理当前显示的属性的属性值
      const attributeValues = Array.from(selectedValues.entries())
        .filter(([attributeId]) => attributeIds.includes(attributeId))
        .flatMap(([attributeId, valueIds]) => 
          valueIds.map(valueId => ({
            attributeId: Number(attributeId),
            attributeValueId: Number(valueId)
          }))
        );

      console.log('要提交的属性值:', attributeValues);

      // 构建完整的数据
      const submitData = {
        name: formData.name,
        description: formData.description || '',
        sort: Number(formData.sort) || 0,
        isActive: Boolean(formData.isActive),
        attributeIds: attributeIds,
        attributeValues: attributeValues
      };

      console.log('提交数据:', submitData);
      
      if (model) {
        // 更新模式
        await contentModelService.update(model.id, submitData);
        toast.success('更新成功');
      } else {
        // 创建模式
        await contentModelService.create(submitData);
        toast.success('创建成功');
      }
      
      setShowConfirmDialog(false);
      setFormData(null);
      setLoading(false);
      
      router.replace('/admin/content-models');
      router.refresh();
    } catch (error) {
      console.error(model ? '更新失败:' : '创建失败:', error);
      toast.error(model ? '更新失败' : '创建失败');
      setLoading(false);
      setShowConfirmDialog(false);
    }
  };

  const handleCancel = () => {
    console.log('取消按钮点击，当前确认框状态:', showConfirmDialog);
    setShowConfirmDialog(false);
    setFormData(null);
    console.log('重置后的状态:', { showConfirmDialog: false, formData: null });
  };

  const toggleAttribute = (attributeId: number, checked: boolean) => {
    console.log('切换属性状态:', { attributeId, checked });
    
    // 更新选中的属性ID列表
    if (checked) {
      setSelectedAttributeIds(prev => [...prev, attributeId]);
      
      // 获取属性及其值
      const attribute = attributes.find(a => a.attributeId === attributeId);
      if (attribute && attribute.values.length > 0) {
        // 选中所有属性值
        const valueIds = attribute.values.map(v => v.id);
        setSelectedValues(prev => {
          const newMap = new Map(prev);
          newMap.set(attributeId, valueIds);
          return newMap;
        });
      }
    } else {
      // 取消选择时，清除所有相关数据
      setSelectedAttributeIds(prev => prev.filter(id => id !== attributeId));
      setSelectedValues(prev => {
        const newMap = new Map(prev);
        newMap.delete(attributeId);
        return newMap;
      });
    }

    // 更新属性的选中状态
    setAttributes(prev => prev.map(attr => {
      if (attr.attributeId === attributeId) {
        return {
          ...attr,
          isSelected: checked,
          // 更新所有值的选中状态
          values: attr.values.map(v => ({
            ...v,
            isSelected: checked  // 根据属性的选中状态设置值的选中状态
          }))
        };
      }
      return attr;
    }));
  };

  const toggleAttributeValue = (attributeId: number, valueId: number, checked: boolean) => {
    console.log('切换属性值状态:', { attributeId, valueId, checked });
    
    const attribute = attributes.find(a => a.attributeId === attributeId);
    if (!attribute) return;

    // 更新选中的值
    setSelectedValues(prev => {
      const newMap = new Map(prev);
      const currentValues = prev.get(attributeId) || [];

      if (checked) {
        if (attribute.type === 'single') {
          // 单选：替换现有值
          newMap.set(attributeId, [valueId]);
        } else {
          // 多选：添加新值
          if (!currentValues.includes(valueId)) {
            newMap.set(attributeId, [...currentValues, valueId]);
          }
        }
      } else {
        // 取消选中：移除值
        const newValues = currentValues.filter(id => id !== valueId);
        if (newValues.length === 0) {
          newMap.delete(attributeId);
          // 如果没有选中的值，自动取消选择属性
          setSelectedAttributeIds(prev => prev.filter(id => id !== attributeId));
          // 更新属性的选中状态
          setAttributes(prev => prev.map(attr => {
            if (attr.attributeId === attributeId) {
              return {
                ...attr,
                isSelected: false,
                values: attr.values.map(v => ({
                  ...v,
                  isSelected: false
                }))
              };
            }
            return attr;
          }));
          return newMap;
        }
        newMap.set(attributeId, newValues);
      }

      return newMap;
    });

    // 更新属性值的选中状态
    setAttributes(prev => prev.map(attr => {
      if (attr.attributeId === attributeId) {
        const updatedValues = attr.values.map(value => ({
          ...value,
          isSelected: attribute.type === 'single' 
            ? value.id === valueId && checked
            : value.id === valueId ? checked : value.isSelected
        }));

        // 检查是否所有值都被取消选择
        const hasSelectedValues = updatedValues.some(v => v.isSelected);
        if (!hasSelectedValues) {
          // 如果没有选中的值，自动取消选择属性
          setSelectedAttributeIds(prev => prev.filter(id => id !== attributeId));
          return {
            ...attr,
            isSelected: false,
            values: updatedValues
          };
        }

        return {
          ...attr,
          values: updatedValues
        };
      }
      return attr;
    }));
  };

  return (
    <>
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          console.log('表单提交事件触发');
          const formData = form.getValues();
          console.log('表单数据:', formData);
          onSubmit(formData);
        }} 
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>设置内容模型的基本信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">名称</Label>
              <Input
                id="name"
                {...form.register('name')}
                placeholder="请输入模型名称"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">描述</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="请输入模型描述"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sort">排序</Label>
              <Input
                id="sort"
                type="number"
                {...form.register('sort', { valueAsNumber: true })}
              />
            </div>

            <div className="flex gap-2 items-center">
              <Switch
                id="isActive"
                checked={form.watch('isActive')}
                onCheckedChange={(checked) => form.setValue('isActive', checked)}
              />
              <Label htmlFor="isActive">启用</Label>
            </div>

            {model && (
              <div className="grid gap-4 pt-4 border-t">
                <div className="grid gap-2">
                  <Label className="text-muted-foreground">创建时间</Label>
                  <div className="text-sm">
                    {new Date(model.createdAt).toLocaleString('zh-CN')}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-muted-foreground">更新时间</Label>
                  <div className="text-sm">
                    {new Date(model.updatedAt).toLocaleString('zh-CN')}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>属性设置</CardTitle>
            <CardDescription>选择并配置模型包含的属性</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attributes.map((attribute) => {
                console.log('渲染属性:', attribute);
                const isAttributeSelected = attribute.isSelected;
                const selectedValueIds = selectedValues.get(attribute.attributeId) || [];
                
                return (
                  <div 
                    key={attribute.attributeId}
                    className={cn(
                      "rounded-lg border p-4 transition-colors",
                      isAttributeSelected && "bg-accent/50"
                    )}
                  >
                    <div className="flex gap-2 items-center">
                      <Switch
                        checked={isAttributeSelected}
                        onCheckedChange={(checked) => toggleAttribute(attribute.attributeId, checked)}
                      />
                      <span className="font-medium">
                        {attribute.attributeName || '未知属性'}
                      </span>
                      <Badge variant="secondary">
                        {attribute.type === 'single' ? '单选' : '多选'}
                      </Badge>
                    </div>

                    {isAttributeSelected && (
                      <div className="mt-4 ml-8">
                        <div className="mb-2 text-sm text-muted-foreground">
                          可选值：{attribute.type === 'single' ? '（单选）' : '（可多选）'}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {attribute.values.map((value) => {
                            const isSelected = value.isSelected;
                            
                            return (
                              <Badge
                                key={value.id}
                                variant={isSelected ? "default" : "outline"}
                                className="cursor-pointer hover:opacity-80"
                                onClick={() => toggleAttributeValue(attribute.attributeId, value.id, !isSelected)}
                              >
                                {value.value}
                                {isSelected && <X className="ml-1 w-3 h-3" />}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={loading}
          >
            取消
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
          >
            {loading ? '提交中...' : (model ? '更新' : '创建')}
          </Button>
        </div>
      </form>

      <AlertDialog 
        open={showConfirmDialog} 
        onOpenChange={(open) => {
          console.log('AlertDialog onOpenChange:', { open, showConfirmDialog });
          if (!open) {
            handleCancel();
          }
        }}
      >
        <AlertDialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle>确认{model ? '更新' : '创建'}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                您确定要{model ? '更新' : '创建'}这个内容模型吗？
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                console.log('取消按钮点击');
                handleCancel();
              }} 
              disabled={loading}
            >
              取消
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                console.log('确认按钮点击');
                handleConfirm();
              }} 
              disabled={loading}
              className={cn(
                "ml-3",
                loading && "opacity-50 cursor-not-allowed"
              )}
            >
              {loading ? '处理中...' : '确认'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 