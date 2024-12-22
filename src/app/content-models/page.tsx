'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { contentModelService } from '@/services/content-model';
import { FileEdit, Plus, Search, Trash2 } from 'lucide-react';
import type { ContentModel } from '@/services/content-model';

export default function ContentModelsPage() {
  const [models, setModels] = React.useState<ContentModel[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  // 加载模型数据
  const loadModels = React.useCallback(async () => {
    try {
      console.log('开始加载模型列表');
      const data = await contentModelService.getAll();
      console.log('获取到的模型数据:', data);
      setModels(data);
    } catch (error) {
      console.error('加载模型失败:', error);
      toast.error('加载模型失败');
    }
  }, []);

  React.useEffect(() => {
    loadModels();
  }, [loadModels]);

  const filteredModels = React.useMemo(() => {
    if (!searchQuery) return models;
    
    return models.filter(model => 
      model.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [models, searchQuery]);

  // 获取属性类型的显示文本
  const getAttributeTypeText = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'single':
        return '单选';
      case 'multiple':
        return '多选';
      default:
        return type || '未知';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <Button asChild>
          <Link href="/admin/content-models/create">
            <Plus className="mr-2 h-4 w-4" />
            新建
          </Link>
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="搜索模型..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9 w-[250px]"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>模型列表</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredModels.map((model) => (
            <div
              key={model.id}
              className="flex justify-between items-center p-4 rounded-lg border"
            >
              <div className="space-y-1">
                <div className="flex gap-2 items-center">
                  <span className="font-medium">{model.name}</span>
                  <Badge variant={model.isActive ? "default" : "secondary"}>
                    {model.isActive ? '启用' : '禁用'}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {model.description || '暂无描述'}
                </div>
                {model.attributes && model.attributes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {model.attributes.map((attr) => (
                      <Badge 
                        key={attr.attributeId} 
                        variant="outline" 
                        className="flex items-center gap-1"
                      >
                        {attr.name}
                        <span className="text-xs text-muted-foreground">
                          ({getAttributeTypeText(attr.type)})
                        </span>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  title="编辑模型"
                  asChild
                >
                  <Link href={`/admin/content-models/${model.id}/edit`}>
                    <FileEdit className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="删除模型"
                  onClick={async () => {
                    if (confirm('确定要删除该内容模型吗？')) {
                      try {
                        await contentModelService.delete(model.id);
                        toast.success('删除成功');
                        loadModels();
                      } catch (error) {
                        console.error('删除失败:', error);
                        toast.error('删除失败');
                      }
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {filteredModels.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              {searchQuery ? '没有找到匹配的模型' : '暂无内容模型'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 