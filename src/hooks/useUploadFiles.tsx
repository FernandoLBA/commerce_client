import { useCallback, useState } from "react";

import { AllowedFilesType } from "@/constants";

export const useUploadFiles = (type: AllowedFilesType) => {
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const cleanErrors = useCallback(() => setErrors([]), []);

  const handleErrors = useCallback((errors: string[]) => {
    setErrors((prev) => [...prev, ...errors])
  }, [])

  const cleanFiles = useCallback(() => setFiles([]), []);

  const handleUploadFiles = useCallback((files: File[]) => {
    const allowedFiles: File[] = [];

    cleanErrors();
    cleanFiles();

    files.forEach((file) => {
      if(!file.type.includes(type.toLowerCase())) {
        handleErrors([`The file "${file.name}" has a not allowed type "${file.type}"`])
        return;
      }
      
      const itExists = allowedFiles.some((allowedFile) => allowedFile.name === file.name)
      
      if(itExists) {
        handleErrors([`The file "${file.name}" already exists`])
        return;
      }

      allowedFiles.push(file);
    })

    setFiles((prev) => [...prev, ...allowedFiles])
  }, [type, cleanErrors, handleErrors, cleanFiles]);


  return {
    files,
    errors,
    handleUploadFiles,
    handleErrors,
    cleanErrors,
    cleanFiles,
  }
}