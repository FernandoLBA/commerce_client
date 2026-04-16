import { useCallback, useState } from 'react';

import { PreLoadedFiles } from '../interfaces';

export const useParseFiles = () => {
  const [parsedFiles, setParsedFiles] = useState<PreLoadedFiles[]>([]);

  const clearParsedFiles = useCallback(() => {
    setParsedFiles([]);
  }, []);

  const handleDeleteParsedFile = useCallback((index: number) => {
    setParsedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleDeleteuplicates = useCallback((files: FileList) => {
    const uniqueFilesMap = new Map<string, File>();

    Array.from(files).forEach((file) => {
      if (!uniqueFilesMap.has(file.name)) {
        uniqueFilesMap.set(file.name, file);
      }
    });

    return Array.from(uniqueFilesMap.values());
  }, []);

  const handleParseFiles = useCallback((files: FileList | null, status: PreLoadedFiles['status'] = 'pending') => {
    if (!files) return;

    const uniqueFiles = handleDeleteuplicates(files);
    const newParsedFiles = Array.from(uniqueFiles).map((file) => {
        return {
          file,
          preview: URL.createObjectURL(file),
          status,
        };
    });

    setParsedFiles(newParsedFiles);
  }, [handleDeleteuplicates]);

  return {
    parsedFiles,
    handleParseFiles,
    handleDeleteParsedFile,
    clearParsedFiles,
  }
};

//** The above code defines a custom React hook called `useParseFiles` that takes in a `FileList` and a parsing function. It uses the `use` hook to asynchronously parse each file in the `FileList` using the provided parsing function. The parsed results are returned as an array of type `T`. If there is an error during parsing, it logs the error to the console.

//** This hook can be used in a React component to easily parse files when they are selected by the user, allowing for asynchronous processing of file data.