import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FroalaEditor from "./TextEditor";  // Asegúrate de que esta ruta sea correcta

interface Product {
  id?: number;
  name: string;
  short_description: string | null;
  description: string;
  base_price: number;
  discount: number;
  currency: string;
  image: string;
  category_id: number;
}

interface ProductFormProps {
  product: Product | null;
  onClose: () => void;
  isCreating: boolean;
}

export function ProductForm({ product, onClose, isCreating }: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>(product);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "base_price" || name === "discount" ? parseFloat(value) : value,
    });
  };

  // Actualizar el contenido de la descripción desde el editor Froala
  const handleChangeContent = (newContent: string) => {
    setFormData((prevData) => ({
      ...prevData,
      description: newContent,  // Actualizamos el campo description con el contenido del editor
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{isCreating ? "Crear Nuevo Producto" : "Editar Producto"}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Producto</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="short_description">Descripción Corta</Label>
            <Textarea
              id="short_description"
              name="short_description"
              value={formData.short_description || ""}
              onChange={handleChange}
              placeholder="Escribe una descripción corta del producto..."
              className="min-h-[100px] resize-y"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            {/* Editor de Froala integrado */}
            <FroalaEditor 
              content={formData.description}
              handleChangeContent={handleChangeContent} 
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="base_price">Precio Base ({formData.currency})</Label>
              <Input
                id="base_price"
                name="base_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.base_price}
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
          <div className="space-y-2">
            <Label htmlFor="image">Imagen (URL)</Label>
            <Input
              id="image"
              name="image"
              value={formData.image || ""}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>
          <div className="border rounded-md p-3 text-center text-muted-foreground text-sm">
            La funcionalidad de comandos no es compatible.
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">{isCreating ? "Crear Producto" : "Guardar Cambios"}</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
