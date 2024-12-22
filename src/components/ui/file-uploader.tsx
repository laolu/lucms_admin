'use client'

import * as React from 'react'
import { useDropzone } from 'react-dropzone'

interface FileUploaderProps {
  accept?: string
  multiple?: boolean
  maxSize?: number
  onUpload: (files: File[]) => void
  children: React.ReactNode
}

export function FileUploader({
  accept,
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 默认 5MB
  onUpload,
  children
}: FileUploaderProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: accept ? { [accept]: [] } : undefined,
    multiple,
    maxSize,
    onDrop: (acceptedFiles) => {
      onUpload(acceptedFiles)
    },
    onDropRejected: (fileRejections) => {
      fileRejections.forEach(({ file, errors }) => {
        if (errors[0]?.code === 'file-too-large') {
          console.error(`文件 ${file.name} 超过大小限制`)
        }
      })
    }
  })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {children}
    </div>
  )
} 