import { useCallback, useState } from 'react';

import { formatFileSize } from '@/lib/utils';

interface ValidationOptions {
  maxFiles: number;
  maxSize: number;
  accept: string;
}

interface ValidationResult<T> {
  files: File[];
  parsedFiles: T[];
  parsedFilesCount: number;
  filesCount: number;
  errors: string;
  isMaxFilesReached: boolean;
  validate: (files: FileList | null) => void;
  setFiles: (files: T[]) => void;
  removeFile: (index: number) => void;
  setParsedFiles: (files: T[]) => void;
  removeParsedFile: (index: number) => void;
  clearAll: () => void;
  isFilesQuantityValid: (files: FileList) => boolean;
  isFileSizeValid: (file: File) => boolean;
  isValidFileType: (file: File) => boolean;
  clearErrors: () => void;
}

export const useFiles = <T>({
  maxFiles,
  maxSize,
  accept,
}: ValidationOptions): ValidationResult<T>=> {
  const [validFiles, setValidFiles] = useState<FileList>(new DataTransfer().files);
  const [uploadedFilesResponse, setUploadedFilesResponse] = useState<T[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isMaxFilesReached, setIsMaxFilesReached] = useState(false);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const parseToUploadedFilesResponse = useCallback((files: FileList): T[] => {
     return Array.from(files) as unknown as T[];
  }, []);

  const stringifyErrors = useCallback((errors: string[]) => {
    return errors.join(', ');
  }, []);

  const isValidFileType = useCallback(
    (file: File): boolean => {
      if (accept === '*') return true;

      const acceptedTypes = accept.split(',').map((type) => type.trim());

      const result = acceptedTypes.some((type) => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.replace('/*', ''));
        }
        return file.type === type || file.name.endsWith(type.replace('.', ''));
      });

      if (!result) {
        setErrors((prev) => [...prev, `El archivo ${file.name} no es un tipo de archivo aceptado`]);
      }

      return result;
    },
    [accept]
  );

  const countValidFiles = useCallback(() => {
    return validFiles.length;
  }, [validFiles]);

  const countParsedFiles = useCallback(() => {
    return uploadedFilesResponse.length;
  }, [uploadedFilesResponse]);

  const isFileSizeValid = useCallback((file: File): boolean => {
    const errorMessage = `El archivo ${file.name} excede el tamaño máximo de ${formatFileSize(maxSize)}`;
    
    if (file.size > maxSize) {
      setErrors((prev) => [...prev, errorMessage]);
      return false;
    }

    return true;
   }, [maxSize]);

  const isFilesQuantityValid = useCallback((files: FileList): boolean => {
    const result = (files.length + uploadedFilesResponse.length) <= maxFiles;
    const errorMessage = `El máximo de archivos permitido es ${maxFiles}. Selecciona ${maxFiles} o menos.`;

// ! LOS ERRORES DEL MISMO TIPO SE CONCATENAN

    if(errors.some((error) => error.includes(errorMessage))) {
      setIsMaxFilesReached(!result);
      return result;
    }
    
    if (!result) {
      setErrors(errors.filter((error) => !error.includes(errorMessage)));
    }

    setIsMaxFilesReached(!result);
    return result;
  }, [maxFiles, errors, uploadedFilesResponse.length]);

  const validate = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) {
        setIsMaxFilesReached(false);
        setErrors((prev) => [...prev, 'No se seleccionaron archivos']);
        return;
      }

      const remainingFiles = maxFiles - (files.length + uploadedFilesResponse.length);

      if (remainingFiles < 0) {
        setErrors((prev) => [...prev, `Máximo ${maxFiles} archivo(s) permitido(s). Selecciona ${maxFiles} o menos.`]);
        setIsMaxFilesReached(true);
        return;
          // return { validFiles: files, validFilesCount: files.length, errors: stringifyErrors(errors), clearErrors };
      } else {
        setIsMaxFilesReached(false);
        setErrors([]);
      }
      
      // Validar cantidad de archivos
      isFilesQuantityValid(files);

      if (isMaxFilesReached) {
        return;
      }

      // Validar cada archivo
      Array.from(files).forEach((file) => {
        const isValidSize = isFileSizeValid(file);
        const isValidType = isValidFileType(file);
        // const isValidQuantity = isFilesQuantityValid(files);

        if (!isValidSize || !isValidType) {
          return;
        }

        // if (isValidSize && isValidType && isValidQuantity) {
          const fileToAdd = new DataTransfer();
          Array.from(validFiles).forEach((f) => fileToAdd.items.add(f));
          fileToAdd.items.add(file);
          const newFiles = fileToAdd.files;
          
          setValidFiles(newFiles);
          setUploadedFilesResponse((prev) => [...prev, ...parseToUploadedFilesResponse(newFiles)]);
        // }
      });

      setIsMaxFilesReached(parseToUploadedFilesResponse.length === maxFiles);
    },
    [ 
      maxFiles, 
      isFilesQuantityValid, 
      isFileSizeValid, 
      isMaxFilesReached, 
      isValidFileType, 
      validFiles, 
      setValidFiles,
      setIsMaxFilesReached, 
      uploadedFilesResponse.length, 
      parseToUploadedFilesResponse, 
      setUploadedFilesResponse, 
      // errors,
      setErrors, 
      // clearErrors, 
    ]
  );

  const removeFile = useCallback((index: number) => {
    setValidFiles((prev) => {
      const newFiles = new DataTransfer();
      Array.from(prev).forEach((file, i) => {
        if (i !== index) {
          newFiles.items.add(file);
        }
      });
      return newFiles.files;
    });
  }, [setValidFiles]);

  const removeParsedFile = useCallback((index: number) => {
    removeFile(index);

    setUploadedFilesResponse((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  }, [setUploadedFilesResponse, removeFile]);

  const clearAll = useCallback(() => {
    setValidFiles(new DataTransfer().files);
    setUploadedFilesResponse([]);
    setErrors([]);
    setIsMaxFilesReached(false);
  }, [setValidFiles, setUploadedFilesResponse, setErrors, setIsMaxFilesReached]);

  return { 
    validate, 
    errors: stringifyErrors(errors), 
    files: Array.from(validFiles),
    setFiles: (files: T[]) => {
      setUploadedFilesResponse(files);
      setValidFiles(new DataTransfer().files);
    },
    removeFile,
    parsedFiles: uploadedFilesResponse, 
    setParsedFiles: (files: T[]) => setUploadedFilesResponse(files),
    removeParsedFile,
    clearAll,
    isFilesQuantityValid,
    isFileSizeValid,
    isValidFileType,
    parsedFilesCount: countParsedFiles(),
    filesCount: countValidFiles(),
    isMaxFilesReached,
    clearErrors,
   };
};
