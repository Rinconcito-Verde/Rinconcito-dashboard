"use client"

import { useState } from "react"
import { Plus, Edit, Trash, MoreHorizontal, ArrowLeft, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CategoryForm } from "./CategoryForm"
import { useCategories } from "../context/CategoryContext"
import type { Category } from "../types/types"

interface CategoryManagerProps {
  onBack: () => void
}

export function CategoryManager({ onBack }: CategoryManagerProps) {
  const { categories, loading, error, deleteCategory, fetchCategories } = useCategories()
  const [isCreating, setIsCreating] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleCreateClick = () => {
    setIsCreating(true)
    setEditingCategory(null)
  }

  const handleEditClick = (category: Category) => {
    setIsCreating(false)
    setEditingCategory(category)
  }

  const handleFormClose = () => {
    setIsCreating(false)
    setEditingCategory(null)
  }

  const handleDeleteClick = async (category: Category) => {
    if (
      confirm(
        `¿Estás seguro de que quieres eliminar la categoría "${category.name}"? Esta acción no se puede deshacer.`,
      )
    ) {
      setDeletingId(category.id)
      try {
        await deleteCategory(category.id)
      } catch (err) {
        console.error("Error deleting category:", err)
      } finally {
        setDeletingId(null)
      }
    }
  }

  const handleRefresh = () => {
    fetchCategories()
  }

  if (isCreating || editingCategory) {
    return <CategoryForm category={editingCategory} onClose={handleFormClose} isCreating={isCreating} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Gestión de Categorías</h1>
            </div>
            <p className="text-muted-foreground">
              Administra las categorías de productos
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={handleCreateClick} disabled={loading}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Categoría
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && categories.length === 0 ? (
        <div className="flex items-center justify-center py-10">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Cargando categorías...</p>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead className="hidden md:table-cell">Slug</TableHead>
                <TableHead className="hidden lg:table-cell">Descripción</TableHead>
                <TableHead className="hidden sm:table-cell">Orden</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-mono text-sm">{category.id}</TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className="font-mono text-xs">
                      {category.slug}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="max-w-xs text-sm text-muted-foreground">
                      {category.description || "Sin descripción"}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {category.sort_order !== null ? (
                      <Badge variant="secondary">{category.sort_order}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={deletingId === category.id}>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menú</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(category)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(category)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {!loading && categories.length === 0 && !error && (
        <div className="text-center py-10">
          <p className="text-muted-foreground mb-4">No hay categorías disponibles.</p>
          <Button onClick={handleCreateClick}>
            <Plus className="mr-2 h-4 w-4" />
            Crear Primera Categoría
          </Button>
        </div>
      )}
    </div>
  )
}
