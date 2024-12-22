'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { QuillEditor as Editor } from '@/components/editor/quill-editor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { contentService } from '@/services/content';
import { contentCategoryService } from '@/services/content-category';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ModelAttributes } from './model-attributes';
import { Loader2 } from 'lucide-react';

interface ContentFormProps {
  id?: string;
}

export function ContentForm({ id }: ContentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    categoryId: '',
    content: '',
    isActive: true,
    sort: 0,
    thumbnail: '',
    images: [] as string[],
    coverImage: '',
    bannerImage: '',
    price: 0,
    originalPrice: 0,
    isFree: false,
    isVipFree: false,
    vipPrice: 0,
    downloadUrl: '',
    downloadPassword: '',
    extractPassword: '',
    tags: [] as string[],
    meta: {} as Record<string, any>,
    source: '',
    author: '',
    publishedAt: '',
    attributeValues: [] as Array<{ attributeId: number, valueId: number }>
  });

  // 加载分类列表
  const fetchCategories = React.useCallback(async () => {
    try {
      const data = await contentCategoryService.getContentTree();
      setCategories(data);
    } catch (error) {
      console.error('获取分类出错:', error);
      toast.error('获取分类失败');
    }
  }, []);

  // 加载分类详情
  const loadCategory = React.useCallback(async (categoryId: string) => {
    try {
      const category = await contentCategoryService.getById(parseInt(categoryId));
      if (!category) {
        setSelectedCategory(null);
        return;
      }
      setSelectedCategory(category);
      
      // 如果是编辑模式，不要清空属性值
      if (!id) {
        setFormData(prev => ({
          ...prev,
          attributeValues: []
        }));
      }
    } catch (error) {
      console.error('加载分类详情失败:', error);
      toast.error('加载分类详情失败');
    }
  }, [id]);

  // 加载内容详情
  const loadContent = React.useCallback(async () => {
    if (!id) return;
    try {
      const [data, attributeValues] = await Promise.all([
        contentService.getById(parseInt(id)),
        contentService.getAttributeValues(parseInt(id))
      ]);

      console.log('加载的内容数据:', data);
      console.log('加载的属性值:', attributeValues);

      // 设置基本信息
      setFormData({
        ...data,
        categoryId: data.categoryId.toString(),
        publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString().split('T')[0] : '',
        images: data.images || [],
        tags: data.tags || [],
        attributeValues: attributeValues.map(av => ({
          attributeId: av.attributeId,
          valueId: av.valueId
        }))
      });

      // 加载分类信息
      if (data.categoryId) {
        await loadCategory(data.categoryId.toString());
      }
    } catch (error) {
      console.error('加载内容失败:', error);
      toast.error('加载内容失败');
    }
  }, [id, loadCategory]);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  React.useEffect(() => {
    if (formData.categoryId) {
      loadCategory(formData.categoryId);
    }
  }, [formData.categoryId, loadCategory]);

  React.useEffect(() => {
    loadContent();
  }, [loadContent]);

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('开始处理表单提交');
    
    try {
      // 表单验证
      const validations = [
        { condition: !formData.title.trim(), message: '请输入标题' },
        { condition: !formData.categoryId, message: '请选择分类' },
        { condition: !formData.content.trim(), message: '请输入内容' },
      ];

      for (const validation of validations) {
        if (validation.condition) {
          console.log('验证失败:', validation.message);
          toast.error(validation.message);
          return;
        }
      }

      setLoading(true);
      
      // 转换属性值格式
      const attributeValueIds = formData.attributeValues.map(av => av.valueId);

      // 确保 categoryId 是数字类型
      const categoryId = parseInt(formData.categoryId);
      if (isNaN(categoryId)) {
        toast.error('分类ID无效');
        return;
      }
      
      const submitData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        categoryId,  // 使用转换后的数字
        description: formData.description?.trim() || '',
        isActive: formData.isActive,
        sort: formData.sort || 0,
        thumbnail: formData.thumbnail?.trim() || '',
        images: formData.images || [],
        coverImage: formData.coverImage?.trim() || '',
        bannerImage: formData.bannerImage?.trim() || '',
        price: Number(formData.price) || 0,
        originalPrice: Number(formData.originalPrice) || 0,
        isFree: formData.isFree || false,
        isVipFree: formData.isVipFree || false,
        vipPrice: Number(formData.vipPrice) || 0,
        downloadUrl: formData.downloadUrl?.trim() || '',
        downloadPassword: formData.downloadPassword?.trim() || '',
        extractPassword: formData.extractPassword?.trim() || '',
        tags: formData.tags || [],
        source: formData.source?.trim() || '',
        author: formData.author?.trim() || '',
        publishedAt: formData.publishedAt ? new Date(formData.publishedAt).toISOString() : null,
        attributeValueIds
      };

      console.log('准备提交的数据:', JSON.stringify(submitData, null, 2));

      if (id) {
        await contentService.update({
          id: parseInt(id),
          ...submitData,
        });
        console.log('更新成功');
        toast.success('更新成功');
      } else {
        console.log('开始调用创建接口');
        const result = await contentService.create(submitData);
        console.log('创建成功，返回数据:', result);
        toast.success('创建成功');
      }
      
      router.push('/admin/contents');
    } catch (error: any) {
      console.error('提交失败:', {
        error,
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      const errorMessage = error.response?.data?.message || (id ? '更新失败' : '创建失败');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 处理标签输入
  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, tags }));
  };

  // 处理图片数组输入
  const handleImagesChange = (value: string) => {
    const images = value.split('\n').map(url => url.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, images }));
  };

  // 构建分类选项
  const buildCategoryOptions = (items: any[], level = 0): React.ReactElement[] => {
    if (!Array.isArray(items)) {
      return [];
    }

    const options = items.reduce((acc: React.ReactElement[], item) => {
      const prefix = '\u00A0'.repeat(level * 4);
      const value = item.id?.toString();
      
      if (!value) {
        return acc;
      }

      acc.push(
        <SelectItem key={value} value={value}>
          {prefix + (item.name || '未命名分类')}
        </SelectItem>
      );

      if (Array.isArray(item.children) && item.children.length > 0) {
        acc.push(...buildCategoryOptions(item.children, level + 1));
      }

      return acc;
    }, []);

    return options;
  };

  // 处理属性值更
  const handleAttributeValueChange = (attributeId: number, valueId: number) => {
    setFormData(prev => {
      // 找到当前属性
      const attribute = selectedCategory?.model?.attributes?.find(
        attr => attr.id === attributeId
      );

      if (!attribute) {
        return prev;
      }

      // 获取当前属性之外的其他属性值
      const otherValues = prev.attributeValues.filter(av => av.attributeId !== attributeId);
      
      // 如果是单选属性，直接替值
      if (attribute.type === 'single') {
        return {
          ...prev,
          attributeValues: [...otherValues, { attributeId, valueId }]
        };
      }
      
      // 如果是多选属性，切换值的选中状态
      const currentValues = prev.attributeValues.filter(av => av.attributeId === attributeId);
      const existingValue = currentValues.find(av => av.valueId === valueId);
      
      if (existingValue) {
        // 如果值已存在，则移除它
        return {
          ...prev,
          attributeValues: prev.attributeValues.filter(
            av => !(av.attributeId === attributeId && av.valueId === valueId)
          )
        };
      } else {
        // 如果值不存在，则添加到当前属性的值列表中
        return {
          ...prev,
          attributeValues: [...prev.attributeValues, { attributeId, valueId }]
        };
      }
    });
  };

  // 在分类选择变更的处理
  const handleCategoryChange = (value: string) => {
    if (!value || value === 'no-category') {
      setFormData(prev => ({ ...prev, categoryId: '', attributeValues: [] }));
      setSelectedCategory(null);
      return;
    }

    setFormData(prev => ({ ...prev, categoryId: value }));
    loadCategory(value);
  };

  return (
    <form 
      onSubmit={(e) => {
        console.log('表单提交事件触发');
        e.preventDefault();
        handleSubmit(e);
      }} 
      className="space-y-6"
    >
      <div className="flex gap-2 justify-end items-center">
        <Button 
          variant="outline" 
          type="button"
          onClick={() => router.back()}
        >
          取消
        </Button>
        <Button 
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              {id ? '更新中...' : '创建中...'}
            </>
          ) : (
            id ? '更新' : '创建'
          )}
        </Button>
      </div>

      {/* 基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
          <CardDescription>设置内容的基本信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 标题 */}
          <div className="grid gap-2">
            <Label htmlFor="title">标题</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="请输入标题"
            />
          </div>

          {/* 描述 */}
          <div className="grid gap-2">
            <Label htmlFor="description">描述</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="请输入描述"
            />
          </div>

          {/* 分类 */}
          <div className="grid gap-2">
            <Label htmlFor="category">分类</Label>
            <Select
              value={formData.categoryId}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="请选择分类" />
              </SelectTrigger>
              <SelectContent>
                {categories && categories.length > 0 ? (
                  buildCategoryOptions(categories)
                ) : (
                  <SelectItem value="no-category" disabled>
                    暂无分类
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {formData.categoryId && selectedCategory && (
              <div className="text-sm text-gray-500">
                {selectedCategory.model ? (
                  `已选择分类: ${selectedCategory.name} (${selectedCategory.model.name})`
                ) : (
                  `已选择分类: ${selectedCategory.name}`
                )}
              </div>
            )}
          </div>

          {/* 模型属性 */}
          {selectedCategory?.model ? (
            <Card>
              <CardHeader>
                <CardTitle>模型属性</CardTitle>
                <CardDescription>
                  {selectedCategory.model.name}
                  {selectedCategory.model.description && (
                    <span className="ml-2 text-gray-400">
                      ({selectedCategory.model.description})
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ModelAttributes
                  model={selectedCategory.model}
                  attributeValues={formData.attributeValues}
                  onAttributeValueChange={handleAttributeValueChange}
                />
              </CardContent>
            </Card>
          ) : formData.categoryId ? (
            <div className="text-sm text-gray-500">该分类未关联模型</div>
          ) : null}

          {/* 其他基本信息字段 */}
          <div className="grid gap-2">
            <Label htmlFor="author">作者</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              placeholder="请输入作者"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="source">来源</Label>
            <Input
              id="source"
              value={formData.source}
              onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
              placeholder="请输入来源"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="publishedAt">发布时间</Label>
            <Input
              id="publishedAt"
              type="date"
              value={formData.publishedAt}
              onChange={(e) => setFormData(prev => ({ ...prev, publishedAt: e.target.value }))}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sort">排序</Label>
            <Input
              id="sort"
              type="number"
              value={formData.sort}
              onChange={(e) => setFormData(prev => ({ ...prev, sort: parseInt(e.target.value) || 0 }))}
            />
          </div>

          <div className="flex gap-2 items-center">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="isActive">启用</Label>
          </div>
        </CardContent>
      </Card>

      {/* 内容详情 */}
      <Card>
        <CardHeader>
          <CardTitle>内容详情</CardTitle>
          <CardDescription>编辑内容详情</CardDescription>
        </CardHeader>
        <CardContent>
          <Editor
            value={formData.content}
            onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
          />
        </CardContent>
      </Card>

      {/* 图片管理 */}
      <Card>
        <CardHeader>
          <CardTitle>图片管理</CardTitle>
          <CardDescription>管理内容相关的图片</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="thumbnail">缩略图</Label>
            <Input
              id="thumbnail"
              value={formData.thumbnail}
              onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
              placeholder="请输入缩略图URL"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="coverImage">封面图</Label>
            <Input
              id="coverImage"
              value={formData.coverImage}
              onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
              placeholder="请输入封面图URL"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bannerImage">横幅图</Label>
            <Input
              id="bannerImage"
              value={formData.bannerImage}
              onChange={(e) => setFormData(prev => ({ ...prev, bannerImage: e.target.value }))}
              placeholder="输入横幅图URL"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="images">图片</Label>
            <Textarea
              id="images"
              value={formData.images.join('\n')}
              onChange={(e) => handleImagesChange(e.target.value)}
              placeholder="请输入图片URL，行一"
            />
          </div>
        </CardContent>
      </Card>

      {/* 价格设置 */}
      <Card>
        <CardHeader>
          <CardTitle>价格设置</CardTitle>
          <CardDescription>设置内容的价格信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 items-center">
            <Switch
              id="isFree"
              checked={formData.isFree}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFree: checked }))}
            />
            <Label htmlFor="isFree">免费内容</Label>
          </div>

          {!formData.isFree && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="price">价格</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="originalPrice">原价</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: parseFloat(e.target.value) || 0 }))}
                />
              </div>

              <Separator className="my-4" />

              <div className="flex gap-2 items-center">
                <Switch
                  id="isVipFree"
                  checked={formData.isVipFree}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isVipFree: checked }))}
                />
                <Label htmlFor="isVipFree">VIP免费</Label>
              </div>

              {!formData.isVipFree && (
                <div className="grid gap-2">
                  <Label htmlFor="vipPrice">VIP价格</Label>
                  <Input
                    id="vipPrice"
                    type="number"
                    step="0.01"
                    value={formData.vipPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, vipPrice: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* 下载设置 */}
      <Card>
        <CardHeader>
          <CardTitle>下载设置</CardTitle>
          <CardDescription>设置内容的下载信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="downloadUrl">下载链接</Label>
            <Input
              id="downloadUrl"
              value={formData.downloadUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, downloadUrl: e.target.value }))}
              placeholder="请输入下载链接"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="downloadPassword">下载密码</Label>
            <Input
              id="downloadPassword"
              value={formData.downloadPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, downloadPassword: e.target.value }))}
              placeholder="请输入下载密码"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="extractPassword">解压密码</Label>
            <Input
              id="extractPassword"
              value={formData.extractPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, extractPassword: e.target.value }))}
              placeholder="请输入解压密码"
            />
          </div>
        </CardContent>
      </Card>

      {/* 高级设置 */}
      <Card>
        <CardHeader>
          <CardTitle>高级设置</CardTitle>
          <CardDescription>设置内容的高级信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="tags">标签</Label>
            <Input
              id="tags"
              value={formData.tags.join(',')}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="请输入标签，用逗号分隔"
            />
          </div>
        </CardContent>
      </Card>
    </form>
  );
} 