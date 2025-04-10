import React, { useState } from "react";
import { Button } from "@/components/ui/button"; 
import { useSnackbar } from 'notistack';

const uploadURL: string = import.meta.env.VITE_FILES_UPLOAD_URL || "http://localhost:3000/upload";
const ApiToken = localStorage.getItem('token');

export const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { enqueueSnackbar } = useSnackbar(); 
  const [uploadedLink, setUploadedLink] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null); 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) {
      enqueueSnackbar("¡No se seleccionó ningún archivo!", { variant: "error" });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(uploadURL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ApiToken}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        if (result.link) {
          setUploadedLink(result.link);
          enqueueSnackbar("¡Archivo subido con éxito!", { variant: "success" });
        } else {
          enqueueSnackbar("No se recibió un enlace en la respuesta", { variant: "error" });
        }
      } else {
        enqueueSnackbar("Error al subir el archivo", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("¡Algo salió mal!", { variant: "error" });
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyLink = () => {
    if (uploadedLink) {
      navigator.clipboard.writeText(uploadedLink); 
      enqueueSnackbar("Enlace copiado al portapapeles", { variant: "success" });
    }
  };

  const getFileType = () => {
    if (file) {
      const fileType = file.type.split("/")[0];
      return fileType;
    }
    return "";
  };

  return (
    <div className="flex flex-col items-center space-y-4 max-w-lg mx-auto">
      <input
        type="file"
        accept="*/*" 
        onChange={handleFileChange}
        className="hidden"
        id="file-input"
      />
      <Button
        type="button"
        onClick={() => document.getElementById("file-input")?.click()}
        className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
      >
        Seleccionar Archivo
      </Button>

      {file && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">Archivo seleccionado: {file.name}</p>
          {getFileType() === "image" && (
            <img
              src={filePreview || ""}
              alt="Vista previa"
              className="mt-2 max-w-xs rounded-lg shadow-lg"
            />
          )}
          {getFileType() === "video" && (
            <video
              src={filePreview || ""}
              controls
              className="mt-2 max-w-xs rounded-lg shadow-lg"
            >
              Tu navegador no soporta videos.
            </video>
          )}
          {getFileType() === "audio" && (
            <audio
              src={filePreview || ""}
              controls
              className="mt-2 rounded-lg shadow-lg"
            >
              Tu navegador no soporta audio.
            </audio>
          )}
        </div>
      )}

      <Button
        type="button"
        onClick={handleUpload}
        disabled={isUploading || !file}
        className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
      >
        {isUploading ? "Subiendo..." : "Subir Archivo"}
      </Button>

      {uploadedLink && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">¡Archivo subido con éxito! Aquí está el enlace:</p>
          <div className="flex items-center justify-center space-x-2">
            <a href={uploadedLink} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              {uploadedLink}
            </a>
            <Button type="button" onClick={handleCopyLink} className="bg-yellow-500 text-white p-2 rounded-lg">
              Copiar Enlace
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

