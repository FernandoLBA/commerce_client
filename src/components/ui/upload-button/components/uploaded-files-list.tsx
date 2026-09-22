import { AlertCircle, CheckCircle, Trash } from "lucide-react";

import { formatFileSize } from "@/lib";
import { AppImage } from "../../app-image";
import { Button } from "../../button";
import { Loading } from "../../loading";
import { PreLoadedFiles } from "../interfaces/pre-loaded-files.interface";

interface UploadedFileListProps {
  index: number;
  uploadedFile: PreLoadedFiles;
  loading?: boolean;
  removeFile: (index: number) => void;
}

export const UploadedFilesList = ({ index, uploadedFile, loading = false, removeFile }: UploadedFileListProps) => {
  return (
    <div
      className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
    >
      {/* Preview de imagen */}
      {uploadedFile.preview && (
        <AppImage
          src={uploadedFile.preview}
          alt={uploadedFile?.file?.name ?? 'Preview'}
          className="h-10 w-10 rounded object-cover"
        />
      )}

      {/* Info del archivo */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-gray-900">
          {uploadedFile?.file?.name ?? 'Archivo sin nombre'}
        </p>
        <p className="text-xs text-gray-500">
          {formatFileSize(uploadedFile?.file?.size ?? 0)}
        </p>
        {/* {uploadedFile.error && (
          <p className="text-xs text-red-600">{uploadedFile.error}</p>
        )} */}
      </div>

      {/* Estado */}
      <div className="flex items-center gap-4">
        {loading && (
          <Loading message='' />
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
          variant='danger'
          disabled={loading}
        >
          <Trash className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}