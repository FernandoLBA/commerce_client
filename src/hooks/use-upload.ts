import { useCallback, useState } from "react";

interface UseUploaProps {
  accept: string;
  maxSize: number;
  maxFiles: number;
  dbFilesCount?: number;
}

export const useUpload = ({ accept, maxSize, maxFiles, dbFilesCount = 0 }: UseUploaProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [remainingFiles, setRemainingFiles] = useState(maxFiles - dbFilesCount);
  const [filesCount, setFilesCount] = useState(dbFilesCount);
  const [isMaxExceeded, setIsMaxExceeded] = useState(false);

  /**
   * Handle files counts
   */
  const handleFilesCount = useCallback((newFiles: File[]) => {
    const total = dbFilesCount + newFiles.length;
    const remainingFiles = maxFiles - total;
    const isMaxExceeded = total > maxFiles;

    setFilesCount(total);
    setRemainingFiles(remainingFiles);
    setIsMaxExceeded(isMaxExceeded);

    return {
      isMaxExceeded,
      total,
      remainingFiles,
    }
  }, [dbFilesCount, maxFiles])

  /**
   * Handle delete duplicate files
   */
  const handleDeleteDuplicateFiles = useCallback((newFiles: File[]) => {
    const uniqueFilesMap = new Map<string, File>();
    
    [...files, ...newFiles].forEach((file) => {
      if (!uniqueFilesMap.has(file.name)) {
        uniqueFilesMap.set(file.name, file);
      }
    });

    return Array.from(uniqueFilesMap.values());
  }, [files]);

  /**
   * Clean errors
   */
  const cleanErrors = useCallback(() => setErrors([]), []);

  /**
   * Clear files
   */
  const clearFiles = useCallback(() => {
    setFiles([]);
    cleanErrors();
    handleFilesCount([])
  }, [cleanErrors, handleFilesCount]);

  /**
   * Delete file
   */
  const handleDeleteFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, [setFiles]);
  
  /**
   * Handle errors
   */
  const handleErrors = useCallback((error: string) => {
    setErrors((prev) => [...prev, error])
  }, []);

  /**
   * Handle validate type
   */
  const handleValidateType = useCallback((file: File, accept: string)=>{
    if (accept === '*') return true;

    const fileType = file.type;
    const acceptedTypesArray = accept.split(',');
    const isValid = acceptedTypesArray.some((acceptedType) => fileType.includes(acceptedType.trim()));

    if(!isValid) {
      handleErrors(`El archivo "${file.name}" tiene un tipo no permitido "${file.type}"`);
    }

    return isValid;
  }, [handleErrors]);

  /**
   * Handle validate size
   */
  const handleValidateSize = useCallback((file: File, maxSize: number) => {
    if (file.size <= maxSize) return true;

    handleErrors(`El archivo "${file.name}" excede el tamaño máximo permitido de ${maxSize} bytes`);
    
    return false;
  }, [handleErrors]);

  /**
   * Handle validate quantity
   */
  const handleValidateQuantity = useCallback((newFiles: File[]) => {
    const { isMaxExceeded, remainingFiles } = handleFilesCount(newFiles);
    
    if(isMaxExceeded) {
      handleErrors(`La cantidad de archivos seleccionados excede el máximo permitido de ${remainingFiles}.`);
      return false;
    }

    return true;
  }, [handleErrors, handleFilesCount]);

  /**
   * Handle validate files
   */
  const handleValidateFiles = useCallback((files: File[]) => {
    const validFiles: File[] = [];

    files.forEach((file) => {
      const isTypeValid = handleValidateType(file, accept);
      const isSizeValid = handleValidateSize(file, maxSize);
      
      if(!isTypeValid || !isSizeValid) {
        return;
      };

      console.log("Que ha pasado?");
      
      validFiles.push(file);
    })
    
    setFiles(validFiles);
    setIsUploading(false);
  }, [setFiles, setIsUploading, handleValidateType, handleValidateSize, accept, maxSize]);

  /**
   * Handle upload files
   */
  const handleUploadFiles = useCallback((newFiles: File[]) => {
    const uniqueFiles = handleDeleteDuplicateFiles(newFiles);
    const isValidQuantity = handleValidateQuantity(uniqueFiles);

    if(!isValidQuantity) return;
    
    setIsUploading(true);
    cleanErrors();
    handleValidateFiles(uniqueFiles);
  }, [handleValidateFiles, cleanErrors, handleValidateQuantity, handleDeleteDuplicateFiles]);

  /**
   * Normalize errors for output
   */
  const normalizedErrors = useCallback(() => {
    return errors.map((error) => error).join(', ');
  }, [errors]);

  /**
   * Allowed extensions message
   */
  const allowedExtensions = useCallback((accept: string) => {
    if (accept === '*') return 'Todos los tipos de archivos';

    const acceptedTypesArray = accept.split(',').map((type) => type.split('/')[1]?.trim());

    return acceptedTypesArray.join(', ');
  }, []);

  return {
    files,
    isUploading,
    errors,
    errorMessage: normalizedErrors(),
    allowedExtensions: allowedExtensions(accept),
    filesCount,
    remainingFiles,
    isMaxExceeded,
    handleValidateQuantity,
    handleUploadFiles,
    handleDeleteFile,
    cleanErrors,
    clearFiles,
  }
}