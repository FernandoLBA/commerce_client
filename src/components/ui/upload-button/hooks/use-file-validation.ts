import { useCallback } from 'react';

import { formatFileSize } from '@/lib/utils';

interface ValidationOptions {
  maxFiles: number;
  maxSize: number;
  accept: string;
}

interface ValidationResult {
  validFiles: File[];
  errors: string[];
  clearErrors: () => void;
}

export const useFileValidation = ({
  maxFiles,
  maxSize,
  accept,
}: ValidationOptions) => {
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
    (files: FileList | null): ValidationResult => {
      if (!files || files.length === 0) {
        return { validFiles: [], errors: [], clearErrors };
      }

      const validFiles: File[] = [];
      let errors: string[] = [];

      function clearErrors () {
        errors = []
      }

      // Validar cantidad de archivos
      if (files.length > maxFiles) {
        errors.push(`Máximo ${maxFiles} archivo(s) permitido(s)`);
        return { validFiles, errors, clearErrors };
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
          validFiles.push(file);
        }
      });

      return { validFiles, errors, clearErrors };
    },
    [maxFiles, maxSize, isValidFileType]
  );

  return { validate };
};
