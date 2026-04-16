'use client';

import { Upload } from 'lucide-react';
import { useCallback, useMemo, useRef } from 'react';

import { FILE_SIZES } from '@/constants';
import { useUpload } from '@/hooks';
import { formatFileSize } from '@/lib/utils';
import { Button } from '../button';
import { UploadedFilesList } from './components';
import { useParseFiles } from './hooks';

export interface UploadButtonProps {
  error?:  string; // Mensaje de error a mostrar (ej. "Archivo demasiado grande" o "Tipo de archivo no permitido")
  files: File[]; // Archivos actualmente seleccionados (pendientes de subir)
  accept?: string; // Tipos de archivos permitidos (ej. "image/*", "application/pdf", ".doc,.docx", etc.)
  multiple?: boolean; // Permitir selección de múltiples archivos
  maxSize?: number; // Tamaño máximo permitido por archivo en bytes
  maxFiles?: number; // Cantidad máxima de archivos permitidos
  disabled?: boolean; // Deshabilitar el botón o área de drag-drop
  loading?: boolean; // Indicar que se está procesando la subida de archivos (puede mostrar un spinner o deshabilitar acciones)
  children?: React.ReactNode; // Contenido personalizado para el botón (ej. "Subir imagen" o "Agregar archivos")
  filesUploaded?: number; // Para casos de edición, cantidad de archivos ya asociados al recurso
  onUpload: (files: File[], accept: string, maxSize: number, maxFiles: number) => void; // Función para manejar la subida de archivos, recibe los archivos seleccionados y las restricciones
  onCancel: () => void; // Función para manejar la acción de cancelar la subida de archivos
  onDeleteFile: (index: number) => void; // Función para manejar la eliminación de un archivo específico, recibe el índice del archivo a eliminar
  onClearFiles: () => void; // Función para manejar la eliminación de todos los archivos seleccionados
  onSubmit: () => Promise<void> | void; // Función para manejar la acción de guardar o enviar los archivos, puede ser asíncrona si requiere esperar a que se complete la subida
}

export function UploadButton({
  onUpload, 
  onDeleteFile, 
  onClearFiles, 
  error,
  files, 
  loading = false,
  accept = '*',
  multiple = false,
  maxSize = FILE_SIZES.IMAGE,
  maxFiles = 1,
  disabled = false,
  children,
  onSubmit,
  filesUploaded = 0,
  onCancel,
}: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { parsedFiles, handleParseFiles, handleDeleteParsedFile, clearParsedFiles } = useParseFiles();

  const uploadedFilesMemo = useMemo(() => filesUploaded, [filesUploaded]);

  const { allowedExtensions, isMaxExceeded, remainingFiles } = useUpload({ accept, maxSize, maxFiles, dbFilesCount: uploadedFilesMemo });
  
  const handleDeleteFiles = useCallback(() => {
    clearParsedFiles();
    onClearFiles();
  }, [clearParsedFiles, onClearFiles]);

  const handleDeleteFile = useCallback((index: number) => {
    onDeleteFile(index);
    handleDeleteParsedFile(index);

  }, [onDeleteFile, handleDeleteParsedFile]);

  const handleFileSelect = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles) return;
      
      handleParseFiles(newFiles, 'pending');
      onUpload(Array.from(newFiles), accept, maxSize, maxFiles);

      // Marcar como exitosos
      handleParseFiles(newFiles, 'success');

      // Marcar como erróneos
      if (error  && error.length > 0) { handleParseFiles(newFiles, 'error') };

      // Limpiar input
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [
      accept, 
      maxFiles, 
      maxSize, 
      error,
      onUpload, 
      handleParseFiles, 
    ]
  );

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleSubmit = async() => {
      await onSubmit()
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

  const handleCancel = () => {
    clearParsedFiles();
    onClearFiles();
    onCancel();
  };

  return (
    <div className="flex flex-col w-full space-y-4">
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
      {(!isMaxExceeded && files.length < maxFiles) ? (
        <div className='flex flex-col gap-4'>
          <div
            className={`rounded-lg border-2 border-dashed ${error ? 'border-red-500' : 'border-gray-300'} p-6 text-center transition-colors hover:border-primary-400 hover:bg-primary-50`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            >
            <Button
              type="button"
              onClick={handleClick}
              disabled={disabled || loading}
              size="md"
              variant={error ? 'danger' : 'primary'}
              >
              <Upload className="h-5 w-5" />
              {children || 'Subir archivo'}
            </Button>

            <p className="my-2 text-md text-gray-500">
              O arrastra archivos aquí
            </p>

            <p className="text-xs text-gray-400">
              Cantidad máxima: {maxFiles} {maxFiles === 1 ? 'archivo' : 'archivos'}
            </p>

            <p className="text-xs text-gray-400">
              Tamaño máximo: {formatFileSize(maxSize)}
            </p>
            
            <p className="my-1 text-sm text-gray-600">
              Archivos restantes: { remainingFiles }
            </p>

            <p className="text-sm text-gray-600">Archivos permitidos: [{ allowedExtensions }]</p>

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          {multiple && (
            <Button 
              type='button' 
              variant='outline' 
              size="md" 
              className='w-full md:w-fit md:self-end' 
              onClick={ handleCancel }
              disabled={ loading }
            >
              Cancelar
            </Button>
          )}
        </div>
      ) : null}

      {/* Listado de archivos */}
      { parsedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">
              Archivos restantes ({ remainingFiles })
            </h3>
            {parsedFiles.length > 0 && (
              <Button
                type="button"
                onClick={ handleDeleteFiles }
                className="text-xs text-gray-500 hover:text-gray-700"
                disabled={ loading }
                variant='link'
              >
                Limpiar todo
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            {parsedFiles.map((parsedFile, index) => (
              <UploadedFilesList 
                key={ index } 
                index={ index } 
                removeFile={ handleDeleteFile } 
                uploadedFile={ parsedFile } 
              />
            ))}
          </div>

          { error && <p className="mt-1 text-sm text-red-600">{error}</p> }
          
          {/* Botón para agregar más archivos */}
          <div className='flex justify-end gap-4'>
            <Button 
              type='button'
              variant='outline' 
              size="md" 
              className='w-full md:w-fit md:self-end' 
              disabled={ disabled || loading } 
              onClick={ handleCancel }
            >
              Cancelar
            </Button>

            { (multiple && !isMaxExceeded) && (
              <Button
                type="button"
                onClick={ handleClick }
                variant="secondary"
                disabled={ disabled || loading || isMaxExceeded }
                size="md"
                >
                Agregar más
              </Button>
            )}

            <Button
              type="button"
              onClick={ handleSubmit }
              disabled={ disabled || (error && error?.length > 0) || loading || isMaxExceeded }
              variant="primary"
              isLoading={ loading }
              size="md"
              >
              Guardar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
