'use client';

import { Upload } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import { cn, formatFileSize } from '@/lib/utils';
import { Button } from '../button';
import { UploadedFilesList } from './components';
import { useFileValidation } from './hooks';
import { UploadedFile } from './interfaces/uploaded-file.interface';

export interface UploadButtonProps {
  onUpload: (files: File[]) => Promise<void> | void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // bytes
  maxFiles?: number;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  className?: string;
  onError?: (error: string) => void;
  showPreview?: boolean;
  isSubmit?: boolean;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

export function UploadButton({
  onUpload,
  accept = '*',
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 10MB default
  maxFiles = 1,
  disabled = false,
  variant = 'primary',
  size = 'md',
  children,
  className,
  onError,
  showPreview = true,
  loading = false,
  isSubmit = false,
  isSubmitting = false,
  onSubmit,
}: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>("")

  const { validate } = useFileValidation({ maxFiles, maxSize, accept });

  const generatePreview = useCallback((file: File): string | undefined => {
    if (!showPreview || !file.type.startsWith('image/')) {
      return undefined;
    }

    return URL.createObjectURL(file);
  }, [showPreview]);

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files) return;

      const { validFiles, errors } = validate(files);

      if (errors.length > 0) {
        const joinedErrors = errors.join(', ');
        onError?.(joinedErrors);
        setError(joinedErrors)
        return;
      }

      // Crear entradas para archivos seleccionados
      const newFiles: UploadedFile[] = validFiles.map((file) => ({
        file,
        preview: generatePreview(file),
        status: 'pending',
      }));

      setUploadedFiles((prev) => [...prev, ...newFiles]);

      // Hacer upload
      setIsUploading(true);
      try {
        await onUpload(validFiles);

        // Marcar como exitosos
        setUploadedFiles((prev) =>
          prev.map((uf) =>
            validFiles.includes(uf.file) ? { ...uf, status: 'success' } : uf
          )
        );

        setError("")
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Error al subir archivos';

        onError?.(errorMessage);
        setError(errorMessage)

        // Marcar como error
        setUploadedFiles((prev) =>
          prev.map((uf) =>
            validFiles.includes(uf.file)
              ? { ...uf, status: 'error', error: errorMessage }
              : uf
          )
        );
      } finally {
        setIsUploading(false);
        // Limpiar input
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }
    },
    [validate, generatePreview, onUpload, onError]
  );

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleSubmit = () => {
    if(isSubmit && onSubmit) {
      onSubmit()
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => {
      const newFiles = [...prev];
      if (newFiles[index]?.preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const clearAll = () => {
    uploadedFiles.forEach((uf) => {
      if (uf.preview) {
        URL.revokeObjectURL(uf.preview);
      }
    });
    setUploadedFiles([]);
  };

  // Estilos base del botón
  const buttonStyles = cn(
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
    // Variantes
    variant === 'primary' &&
      'bg-primary-600 text-white hover:bg-primary-700 disabled:bg-primary-400',
    variant === 'secondary' &&
      'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-100',
    variant === 'ghost' &&
      'bg-transparent text-blue-600 hover:bg-blue-50 disabled:text-gray-400',
    variant === 'danger' &&
      'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400',
    // Tamaños
    size === 'sm' && 'px-3 py-1.5 text-sm',
    size === 'md' && 'px-4 py-2 text-base',
    size === 'lg' && 'px-6 py-3 text-lg',
    // Estados
    (disabled || isUploading || loading) && 'cursor-not-allowed opacity-50',
    className
  );

  return (
    <div className="w-full space-y-4">
      {/* Input oculto */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Botón o área de drag-drop */}
      {uploadedFiles.length <= 0 ? (
        <div
          className="rounded-lg borøder-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-blue-400 hover:bg-blue-50"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Button
            type="button"
            onClick={handleClick}
            disabled={disabled || isUploading}
            // className={buttonStyles}
            variant={variant}
          >
            <Upload className="h-5 w-5" />
            {children || 'Subir archivo'}
          </Button>

          <p className="mt-2 text-xs text-gray-500">
            O arrastra archivos aquí
          </p>
          {maxSize && (
            <p className="text-xs text-gray-400">
              Máximo: {formatFileSize(maxSize)}
            </p>
          )}
        </div>
      ) : null}

      {/* Listado de archivos */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">
              Archivos ({uploadedFiles.length})
            </h3>
            {uploadedFiles.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                Limpiar todo
              </button>
            )}
          </div>
          
          <div className="space-y-2">
            {uploadedFiles.map((uploadedFile, index) => (
              <UploadedFilesList 
                key={index} 
                index={index} 
                loading={loading} 
                removeFile={removeFile} 
                uploadedFile={uploadedFile} 
              />
            ))}
          </div>

          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          
          {/* Botón para agregar más archivos */}
          <div className='flex justify-end gap-4'>
            {multiple && (
              <Button
                type="button"
                onClick={handleClick}
                variant={isSubmit ? "outline" : variant}
                className='w-fit'
                disabled={disabled || isUploading}
              >
                Agregar más
              </Button>
            )}

            {isSubmit && 
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={disabled || error.length > 0 || isUploading || isSubmitting}
                variant={variant}
                className={`w-fit`}
                isLoading={isSubmitting}
                >
                Guardar
              </Button>
            }
          </div>
        </div>
      )}
    </div>
  );
}
