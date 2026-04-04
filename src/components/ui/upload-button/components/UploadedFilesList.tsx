import { AlertCircle, CheckCircle, X } from "lucide-react";

import { formatFileSize } from "@/lib";
import { Button } from "../../button";
import { Loading } from "../../loading";
import { UploadedFile } from "../interfaces/uploaded-file.interface";

interface UploadedFileListProps {
  index: number;
  uploadedFile: UploadedFile;
  loading: boolean;
  removeFile: (index: number) => void;
}

export const UploadedFilesList = ({ index, uploadedFile, loading, removeFile }: UploadedFileListProps) => {
  return (
    <div
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
  )
}