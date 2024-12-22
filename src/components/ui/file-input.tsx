'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Input } from './input';
import { ImagePlus, X } from 'lucide-react';

export interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFileSelect?: (file: File) => void;
  preview?: string;
  onRemove?: () => void;
  className?: string;
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, onFileSelect, preview, onRemove, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleClick = () => {
      inputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && onFileSelect) {
        onFileSelect(file);
      }
    };

    return (
      <div className={cn('relative', className)}>
        <Input
          type="file"
          className="hidden"
          onChange={handleChange}
          ref={inputRef}
          {...props}
        />
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="h-40 w-full rounded-lg object-cover"
            />
            {onRemove && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -right-2 -top-2 h-6 w-6"
                onClick={onRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="h-40 w-full"
            onClick={handleClick}
          >
            <ImagePlus className="mr-2 h-4 w-4" />
            上传图片
          </Button>
        )}
      </div>
    );
  }
);

FileInput.displayName = 'FileInput';

export default FileInput; 