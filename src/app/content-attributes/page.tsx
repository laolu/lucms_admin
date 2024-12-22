'use client'

import * as React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, Search, Pencil, Trash2, FileEdit } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { contentAttributeService, type ContentAttribute, AttributeType } from '@/services/content-attribute'
import { cn } from "@/lib/utils"
import { AttributeDialog } from './attribute-dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

export default function ContentAttributesPage() {
  const [attributes, setAttributes] = React.useState<ContentAttribute[]>([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogTitle, setDialogTitle] = React.useState('');
  const [editingAttribute, setEditingAttribute] = React.useState<ContentAttribute | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deletingAttribute, setDeletingAttribute] = React.useState<ContentAttribute | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  // 加载属性数据
  const loadAttributes = React.useCallback(async () => {
    try {
      const data = await contentAttributeService.getAll();
      setAttributes(data);
    } catch (error) {
      toast.error('加载属性失败');
    }
  }, []);

  React.useEffect(() => {
    loadAttributes();
  }, [loadAttributes]);

  const handleAddAttribute = () => {
    setDialogTitle('添加属性');
    setEditingAttribute(null);
    setDialogOpen(true);
  };

  const handleEditAttribute = (attribute: ContentAttribute) => {
    setDialogTitle('编辑属性');
    setEditingAttribute(attribute);
    setDialogOpen(true);
  };

  const handleDeleteAttribute = (attribute: ContentAttribute) => {
    setDeletingAttribute(attribute);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingAttribute) {
        await contentAttributeService.update(editingAttribute.id, data);
        toast.success('属���已更新');
      } else {
        await contentAttributeService.create(data);
        toast.success('属性已添加');
      }
      loadAttributes();
      setDialogOpen(false);
    } catch (error) {
      toast.error(editingAttribute ? '更新属性失败' : '添加属性失败');
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingAttribute) {
      try {
        await contentAttributeService.delete(deletingAttribute.id);
        toast.success('属性已删除');
        loadAttributes();
        setDeleteDialogOpen(false);
      } catch (error) {
        toast.error('删除属性失败');
      }
    }
  };

  const filteredAttributes = React.useMemo(() => {
    if (!searchQuery) return attributes;
    
    return attributes.filter(attribute => 
      attribute.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [attributes, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <Button onClick={handleAddAttribute}>
          <Plus className="mr-2 h-4 w-4" />
          新建
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="搜索属性..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="py-4">
          <div className="flex items-center gap-4 px-4 text-sm text-muted-foreground">
            <div className="w-[200px]">属性名称</div>
            <div className="w-[100px]">类型</div>
            <div className="flex-1">属性值</div>
            <div className="w-[80px]">状态</div>
            <div className="w-[120px] text-center">操作</div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {filteredAttributes.map((attribute) => (
            <div
              key={attribute.id}
              className="group flex items-center gap-4 py-2 px-4 rounded-lg hover:bg-accent/50"
            >
              <div className="w-[200px] font-medium">
                {attribute.name}
              </div>
              <div className="w-[100px]">
                {attribute.type === AttributeType.SINGLE ? '单选' : '多选'}
              </div>
              <div className="flex-1 flex flex-wrap gap-1">
                {attribute.values.map((value) => (
                  <Badge key={value.id} variant="secondary">
                    {value.value}
                  </Badge>
                ))}
              </div>
              <div className="w-[80px]">
                <Badge variant={attribute.isActive ? "default" : "secondary"}>
                  {attribute.isActive ? '启用' : '禁用'}
                </Badge>
              </div>

              <div className="flex gap-1 items-center w-[120px] justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditAttribute(attribute)}
                  className="w-8 h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  title="编辑属性"
                >
                  <FileEdit className="w-4 h-4" />
                  <span className="sr-only">编辑</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteAttribute(attribute)}
                  className="w-8 h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="删除属性"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="sr-only">删除</span>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <AttributeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={dialogTitle}
        attribute={editingAttribute}
        onSubmit={handleSubmit}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除属性 "{deletingAttribute?.name}" 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleConfirmDelete}
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 