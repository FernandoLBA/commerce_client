'use client';

import { AlertCircle, CheckCircle, Upload, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import { cn, formatFileSize } from '@/lib/utils';
import { Button } from '../button';
import { Loading } from '../loading';
import { useFileValidation } from './hooks';
import { UploadedFile } from './interfaces/uploaded-file.interface';

interface UploadButtonProps {
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
}: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

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
        onError?.(errors.join(', '));
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
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Error al subir archivos';

        onError?.(errorMessage);

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
      {uploadedFiles.length === 0 || multiple ? (
        <div
          className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-blue-400 hover:bg-blue-50"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Button
            type="button"
            onClick={handleClick}
            disabled={disabled || isUploading}
            className={buttonStyles}
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
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
              >
                {/* Preview de imagen */}
                {uploadedFile.preview && (
                  <img
                    src={uploadedFile.preview}
                    alt={uploadedFile.file.name}
                    className="h-10 w-10 rounded object-cover"
                  />
                )}

                {/* Info del archivo */}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(uploadedFile.file.size)}
                  </p>
                  {uploadedFile.error && (
                    <p className="text-xs text-red-600">{uploadedFile.error}</p>
                  )}
                </div>

                {/* Estado */}
                <div className="flex items-center gap-2">
                  {loading && (
                    <Loading message='' />
                    // <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                  )}
                  {uploadedFile.status === 'success' && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  {uploadedFile.status === 'error' && (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}

                  {/* Botón eliminar */}
                  <Button
                    type="button"
                    onClick={() => removeFile(index)}
                    variant='outline'
                    disabled={loading}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Botón para agregar más archivos */}
          {multiple && (
            <Button
              type="button"
              onClick={handleClick}
              disabled={disabled || isUploading}
              variant={variant}
              // className={cn(buttonStyles, 'w-full')}
            >
              <Upload className="h-5 w-5" />
              Agregar más
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
