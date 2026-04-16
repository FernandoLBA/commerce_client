export interface PreLoadedFiles {
  file: File;
  preview?: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
}
