import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  image: string;
  setImage: (imageUrl: string) => void;
}

const uploadURL: string = import.meta.env.VITE_FILES_UPLOAD_URL || "http://localhost:3000/upload";
const ApiToken = localStorage.getItem('token')
export function ImageUpload({ image, setImage }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const response = await fetch(uploadURL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ApiToken}`,
        },
        body: formData,
      });
      const data = await response.json();

      if (data.link) {
        setImage(data.link); 
      } else {
        console.error("Error al cargar la imagen", data);
      }
    } catch (error) {
      console.error("Error en la carga de imagen", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <img src={image || ""} alt="" className="w-30 h-30 object-cover"/>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        id="image-input"
      />
      <Button
        type="button"
        onClick={() => document.getElementById("image-input")?.click()}
      >
        Seleccionar Imagen
      </Button>
      <Button type="button" onClick={handleImageUpload} disabled={isUploading}>
        {isUploading ? "Subiendo..." : "Subir Imagen"}
      </Button>
    </div>
  );
}
