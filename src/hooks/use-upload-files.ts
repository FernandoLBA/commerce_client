import { useCallback, useState } from "react";

import { AllowedFilesType } from "@/constants";

export const useUploadFiles = (type: AllowedFilesType) => {
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const cleanErrors = useCallback(() => setErrors([]), []);

  const handleErrors = useCallback((errors: string[]) => {
    setErrors((prev) => [...prev, ...errors])
  }, [])

  const cleanFiles = useCallback(() => setFiles([]), [setFiles]);

  const handleUploadFiles = useCallback((files: File[]) => {
    const allowedFiles: File[] = [];

    cleanErrors();

    files.forEach((file) => {
      if(!file.type.includes(type.toLowerCase())) {
        handleErrors([`El archivo "${file.name}" tiene un tipo no permitido "${file.type}"`])
        return;
      }
      
      const itExists = allowedFiles.some((allowedFile) => allowedFile.name === file.name)
      
      if(itExists) {
        handleErrors([`El archivo "${file.name}" ya fue seleccionado`])
        return;
      }

      allowedFiles.push(file);
    })

    setFiles((prev) => {
      return [...prev, ...allowedFiles];
    })
  }, [type, setFiles, cleanErrors, handleErrors, ]);


  return {
    files,
    errors,
    handleUploadFiles,
    handleErrors,
    cleanErrors,
    cleanFiles,
  }
}