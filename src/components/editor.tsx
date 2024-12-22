'use client'

import * as React from 'react'
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react'
import { useEffect, useRef } from 'react'
import { resourceService } from '@/services/resource'
import { toast } from 'sonner'

interface EditorProps {
  value: string
  onChange: (value: string) => void
  height?: number
}

export function Editor({ value, onChange, height = 500 }: EditorProps) {
  const editorRef = useRef<any>(null)

  return (
    <TinyMCEEditor
      onInit={(evt, editor) => editorRef.current = editor}
      value={value}
      onEditorChange={(newValue) => onChange(newValue)}
      init={{
        height,
        language: 'zh_CN',
        menubar: 'file edit view insert format tools table help',
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
          'emoticons', 'paste'
        ],
        toolbar: [
          'undo redo | formatselect | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify',
          'bullist numlist outdent indent | removeformat | help | link image media table | emoticons | fullscreen'
        ],
        content_style: `
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
            font-size: 16px;
            line-height: 1.6;
          }
          p { margin: 0 0 1em 0; }
        `,
        paste_data_images: true,
        branding: false,
        promotion: false,
        resize: true,
        statusbar: true,
        elementpath: false,
        paste_word_valid_elements: "b,strong,i,em,h1,h2,h3,h4,h5,h6,p,div",
        paste_retain_style_properties: "color,background-color,font-size,text-align,line-height",
        browser_spellcheck: true,
        contextmenu: false,
        image_title: true,
        automatic_uploads: true,
        images_upload_handler: async function (blobInfo, progress) {
          try {
            // 检查文件类型
            const file = blobInfo.blob()
            if (!resourceService.isImage(file)) {
              throw new Error('只能上传图片文件')
            }

            // 检查文件大小（5MB）
            if (!resourceService.checkImageSize(file)) {
              throw new Error('图片大小不能超过5MB')
            }

            // 上传图片
            const result = await resourceService.uploadImage(file, progress)
            return result.url

          } catch (error: any) {
            toast.error(error.message || '图片上传失败')
            throw error
          }
        },
        images_upload_credentials: true,
        images_reuse_filename: true,
        // 配置图片上传相关的提示文本
        language_url: '/tinymce/langs/zh_CN.js',
        images_upload_base_path: '/uploads',
        image_dimensions: true,
        image_class_list: [
          { title: '无样式', value: '' },
          { title: '响应式', value: 'img-fluid' },
          { title: '圆角', value: 'rounded' }
        ],
        // 文件选择过滤器
        file_picker_types: 'image',
        images_file_types: 'jpeg,jpg,png,gif,webp',
        // 图片工具栏
        image_toolbar: 'alignleft aligncenter alignright | rotateleft rotateright | imageoptions'
      }}
    />
  )
} 