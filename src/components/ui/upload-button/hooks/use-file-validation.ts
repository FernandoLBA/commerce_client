import { useCallback, useState } from 'react';

import { formatFileSize } from '@/lib/utils';
import { UploadedFile } from '../interfaces/uploaded-file.interface';

interface ValidationOptions {
  maxFiles: number;
  maxSize: number;
  accept: string;
}

interface ValidationResult {
  validFiles: File[];
  validFilesCount: number;
  errors: string;
  clearErrors: () => void;
}

export const useFileValidation = ({
  maxFiles,
  maxSize,
  accept,
}: ValidationOptions) => {
  const [isMaxFilesReached, setIsMaxFilesReached] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const clearErrors = useCallback(() => {
    setUploadedFiles([]);
  }, []);


  const stringifyErrors = useCallback((errors: string[]) => {
    return errors.join(', ');
  }, []);

  const isValidFileType = useCallback(
    (file: File): boolean => {
      if (accept === '*') return true;

      const acceptedTypes = accept.split(',').map((type) => type.trim());

      return acceptedTypes.some((type) => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.replace('/*', ''));
        }
        return file.type === type || file.name.endsWith(type.replace('.', ''));
      });
    },
    [accept]
  );

  const validate = useCallback(
    (files: File[] | null): ValidationResult => {
      // const validFiles: File[] = [];
      // let errors: string[] = [];

      if (!files || files.length === 0) {
        setIsMaxFilesReached(false);
        setErrors((prev) => [...prev, 'No se seleccionaron archivos']);
        return { validFiles: [], validFilesCount: 0, errors: stringifyErrors(errors), clearErrors };
      }

      const remainingFiles = maxFiles - (files.length + uploadedFiles.length);

      if (remainingFiles < 0) {
        setErrors((prev) => [...prev, `Máximo ${maxFiles} archivo(s) permitido(s). Selecciona ${maxFiles} o menos.`]);
        setIsMaxFilesReached(true);
        return { validFiles: files, validFilesCount: files.length, errors: stringifyErrors(errors), clearErrors };
      } else {
        setIsMaxFilesReached(false);
        setErrors([]);
      }
      
      // Validar cantidad de archivos
      if (uploadedFiles.length > maxFiles) {
        setIsMaxFilesReached(true);
        errors.push(`Máximo ${remainingFiles} archivo(s) permitido(s)`);
        return { validFiles: uploadedFiles, validFilesCount: uploadedFiles.length, errors: stringifyErrors(errors), clearErrors };
      }

      // Validar cada archivo
      Array.from(files).forEach((file) => {
        const isValidSize = file.size <= maxSize;
        const isValidType = isValidFileType(file);

        if (!isValidSize) {
          errors.push(
            `${file.name} excede el tamaño máximo de ${formatFileSize(maxSize)}`
          );
        }

        if (!isValidType) {
          errors.push(`${file.name} no es un tipo de archivo válido`);
        }

        if (isValidSize && isValidType) {
          setUploadedFiles((prev) => [...prev, file]);
        }
      });

      setIsMaxFilesReached(files.length === maxFiles);

      return { validFiles: uploadedFiles, validFilesCount: uploadedFiles.length, errors: stringifyErrors(errors), clearErrors };
    },
    [maxFiles, maxSize, errors, setErrors, setIsMaxFilesReached, stringifyErrors, isValidFileType, clearErrors, uploadedFiles]
  );

  return { validate, uploadedFiles, setUploadedFiles, isMaxFilesReached };
};
