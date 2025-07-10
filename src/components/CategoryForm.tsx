"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCategories } from "../context/CategoryContext"
import type { Category } from "../types/types"

interface CategoryFormProps {
  category: Category | null
  onClose: () => void
  isCreating: boolean
}

export function CategoryForm({ category, onClose, isCreating }: CategoryFormProps) {
  console.log(category)
  const { addCategory, updateCategory, } = useCategories()
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    sort_order: "",
  })
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        sort_order: category.sort_order?.toString() || "",
      })
    }
  }, [category])

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const updated = { ...prev, [name]: value }

      // Auto-generate slug when name changes
      if (name === "name" && isCreating) {
        updated.slug = generateSlug(value)
      }

      return updated
    })
    setFormError(null)
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setFormError("El nombre es obligatorio")
      return false
    }
    if (!formData.slug.trim()) {
      setFormError("El slug es obligatorio")
      return false
    }
    if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      setFormError("El slug solo puede contener letras minúsculas, números y guiones")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setFormError(null)

    try {
      const categoryData = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim() || null,
        sort_order: formData.sort_order ? Number.parseInt(formData.sort_order) : null,
      }

      if (isCreating) {
        await addCategory(categoryData)
      } else if (category) {
        await updateCategory(category.id, categoryData)
      }

      onClose()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al guardar la categoría"
      setFormError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle>{isCreating ? "Crear Nueva Categoría" : "Editar Categoría"}</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} disabled={isSubmitting}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-4">
          {formError && (
            <Alert variant="destructive">
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Categoría *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Electrónica, Ropa, etc."
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="ej: electronica, ropa"
                required
                disabled={isSubmitting}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Solo letras minúsculas, números y guiones. Se genera automáticamente.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe brevemente esta categoría..."
              className="min-h-[100px] resize-y"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort_order">Orden de Clasificación</Label>
            <Input
              id="sort_order"
              name="sort_order"
              type="number"
              value={formData.sort_order}
              onChange={handleChange}
              placeholder="Ej: 1, 2, 3..."
              min="0"
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              Número para ordenar las categorías. Menor número.
            </p>
          </div>

        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={!formData.name.trim() || !formData.slug.trim() || isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isCreating ? "Crear Categoría" : "Guardar Cambios"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
