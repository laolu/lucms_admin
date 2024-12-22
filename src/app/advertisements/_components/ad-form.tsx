'use client'

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { advertisementService } from '@/services/advertisement';
import client from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-config';
import { AdImage, AdPosition, AdType, AD_POSITIONS } from '@/types/advertisement';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import FileInput from '@/components/ui/file-input';

const formSchema = z.object({
  title: z.string().min(1, '请输入标题'),
  type: z.enum(['single', 'carousel', 'multiple']),
  images: z.array(z.object({
    url: z.string(),
    title: z.string().optional(),
    link: z.string().optional(),
  })).min(1, '请上传至少一张图片'),
  position: z.enum(['HOME_CAROUSEL', 'HOME_BANNER', 'SIDEBAR', 'CONTENT_TOP', 'CONTENT_BOTTOM']),
  sort: z.coerce.number().min(0, '排序号必须大于等于0'),
  isVisible: z.boolean(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AdFormProps {
  id?: string;
}

export default function AdForm({ id }: AdFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      type: 'single',
      images: [],
      position: 'HOME_BANNER',
      sort: 0,
      isVisible: true,
    },
  });

  React.useEffect(() => {
    if (id) {
      loadAd();
    }
  }, [id]);

  const loadAd = async () => {
    try {
      setLoading(true);
      const ad = await advertisementService.getById(Number(id));
      form.reset({
        title: ad.title,
        type: ad.type,
        images: ad.images,
        position: ad.position,
        sort: ad.sort,
        isVisible: ad.isVisible,
        startDate: ad.startDate,
        endDate: ad.endDate,
      });
    } catch (error) {
      console.error('Failed to load advertisement:', error);
      toast({
        variant: 'destructive',
        title: '加载失败',
        description: '无法加载广告信息',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      if (id) {
        await advertisementService.update({
          id: Number(id),
          ...data,
        });
        toast({
          title: '更新成功',
          description: '广告已更新',
        });
      } else {
        await advertisementService.create(data);
        toast({
          title: '创建成功',
          description: '广告已创建',
        });
      }
      router.push('/admin/advertisements');
      router.refresh();
    } catch (error) {
      console.error('Failed to save advertisement:', error);
      toast({
        variant: 'destructive',
        title: '保存失败',
        description: '无法保存广告信息',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = form.getValues('images');
    form.setValue('images', currentImages.filter((_, i) => i !== index));
  };

  const handleTypeChange = (type: AdType) => {
    form.setValue('type', type);
    const currentImages = form.getValues('images');
    const maxImages = type === 'single' ? 1 : type === 'carousel' ? 5 : 10;
    if (currentImages.length > maxImages) {
      form.setValue('images', currentImages.slice(0, maxImages));
    }
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await client.post(API_ENDPOINTS.UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      const { data } = response.data;
      if (data?.url) {
        return data.url;
      }
      throw new Error('上传失败');
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast({
        variant: 'destructive',
        title: '上传失败',
        description: error instanceof Error ? error.message : '无法上传图片',
      });
      return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>标题</FormLabel>
              <FormControl>
                <Input {...field} disabled={loading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>广告类型</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value: AdType) => handleTypeChange(value)}
                  defaultValue={field.value}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="single" id="single" />
                    <label htmlFor="single">单图</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="multiple" id="multiple" />
                    <label htmlFor="multiple">多图</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="carousel" id="carousel" />
                    <label htmlFor="carousel">轮播</label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>图片</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {field.value.length === 0 && (
                    <FileInput
                      accept="image/*"
                      onFileSelect={async (file: File) => {
                        const url = await handleUpload(file);
                        if (url) {
                          form.setValue('images', [{ url }]);
                        }
                      }}
                    />
                  )}
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {field.value.map((image, index) => (
                      <Card key={index} className="relative">
                        <CardContent className="p-2">
                          <FileInput
                            preview={image.url}
                            onRemove={() => handleRemoveImage(index)}
                            onFileSelect={async (file: File) => {
                              const url = await handleUpload(file);
                              if (url) {
                                const images = [...field.value];
                                images[index] = {
                                  ...images[index],
                                  url,
                                };
                                form.setValue('images', images);
                              }
                            }}
                          />
                          {form.getValues('type') !== 'single' && (
                            <div className="mt-2 space-y-2">
                              <Input
                                placeholder="��片标题"
                                value={image.title || ''}
                                onChange={(e) => {
                                  const images = [...field.value];
                                  images[index] = {
                                    ...images[index],
                                    title: e.target.value,
                                  };
                                  form.setValue('images', images);
                                }}
                              />
                              <Input
                                placeholder="跳转链接"
                                value={image.link || ''}
                                onChange={(e) => {
                                  const images = [...field.value];
                                  images[index] = {
                                    ...images[index],
                                    link: e.target.value,
                                  };
                                  form.setValue('images', images);
                                }}
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {field.value.length > 0 && form.getValues('type') !== 'single' && (
                    <FileInput
                      accept="image/*"
                      onFileSelect={async (file: File) => {
                        const type = form.getValues('type');
                        const maxImages = type === 'carousel' ? 5 : 10;

                        if (field.value.length >= maxImages) {
                          toast({
                            variant: 'destructive',
                            title: '上传失败',
                            description: `最多只能上传${maxImages}张图片`,
                          });
                          return;
                        }

                        const url = await handleUpload(file);
                        if (url) {
                          form.setValue('images', [
                            ...field.value,
                            { url },
                          ]);
                        }
                      }}
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>位置</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择位置" />
                </SelectTrigger>
                <SelectContent>
                  {AD_POSITIONS.map((position) => (
                    <SelectItem key={position.value} value={position.value}>
                      {position.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>开始时间</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>结束时间</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="sort"
            render={({ field }) => (
              <FormItem>
                <FormLabel>排序</FormLabel>
                <FormControl>
                  <Input type="number" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isVisible"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>是否显示</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            取消
          </Button>
          <Button type="submit" disabled={loading}>
            {id ? '更新' : '创建'}
          </Button>
        </div>
      </form>
    </Form>
  );
} 