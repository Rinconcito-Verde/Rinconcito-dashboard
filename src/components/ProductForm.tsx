import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FroalaEditor from "./TextEditor";
import { useNavigate, useParams } from "react-router-dom";
import { useProductsContext } from "../context/ProductsContext";
import { ImageUpload } from "./ImageUpload";

interface Product {
  id?: number;
  name: string;
  slug: string;
  short_description: string | null;
  description: string;
  price: number;
  discount: number;
  currency: string;
  image: string;
  category_id: number;
}

export function ProductForm({ isCreating }: { isCreating: boolean }) {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { packages, productMock, editPackage, addPackage } = useProductsContext();

  const [formData, setFormData] = useState<Partial<Product> | null>(null);

  useEffect(() => {
    if (isCreating) {
      setFormData(productMock);
    } else {
      const foundProduct = packages.find((p) => p.id === Number(productId));
      if (foundProduct) {
        setFormData(foundProduct);
      } else {
        navigate("/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreating, productId]);

  if (!formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev!,
      [name]: name === "price" || name === "discount" ? parseFloat(value) : value,
    }));
  };

  const handleChangeContent = (newContent: string) => {
    setFormData((prev) => ({
      ...prev!,
      description: newContent,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedDescription = formData?.description.replace(
      /<p[^>]*data-f-id="pbf"[^>]*>.*?<\/p>/g,
      ""
    );

    const updatedFormData = {
      ...formData,
      description: cleanedDescription,
    };

    if (isCreating) {
      await addPackage(updatedFormData);
    } else if (updatedFormData?.id) {
      await editPackage(updatedFormData);
    }
  };

  return (
    <Card className="max-w-[1232px] mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{isCreating ? "Crear Nuevo Producto" : "Editar Producto"}</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Producto</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength={70}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="ej: nombre-del-producto"
              required
              maxLength={70}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="short_description">Descripción Corta</Label>
            <Textarea
              id="short_description"
              name="short_description"
              value={formData.short_description || ""}
              onChange={handleChange}
              placeholder="Escribe una descripción corta..."
              className="min-h-[10px] resize-y"
              maxLength={70}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <FroalaEditor
              content={formData.description}
              handleChangeContent={handleChangeContent}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Precio Base ({formData.currency})</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Descuento (%)</Label>
              <Input
                id="discount"
                name="discount"
                type="number"
                step="1"
                min="0"
                value={formData.discount}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <ImageUpload
            image={formData.image}
            setImage={(newImage: string) =>
              setFormData((prev) => ({ ...prev!, image: newImage }))
            }
          />
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <p> </p>
          <Button type="submit">
            {isCreating ? "Crear Producto" : "Guardar Cambios"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
