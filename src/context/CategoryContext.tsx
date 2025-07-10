"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from "./types"
import {
  getCategories,
  createCategory as createCategoryAPI,
  updateCategory as updateCategoryAPI,
  deleteCategory as deleteCategoryAPI,
} from "@/services/packageApi"
import { enqueueSnackbar } from "notistack"

interface CategoryContextType {
  categories: Category[]
  loading: boolean
  error: string | null
  fetchCategories: () => Promise<void>
  addCategory: (category: CreateCategoryRequest) => Promise<void>
  updateCategory: (id: number, category: UpdateCategoryRequest) => Promise<void>
  deleteCategory: (id: number) => Promise<void>
  getCategoryById: (id: number) => Category | undefined
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined)

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getCategories()
      const sortedCategories = data.sort((a, b) => {
        if (a.sort_order !== null && b.sort_order !== null) {
          return a.sort_order - b.sort_order
        }
        if (a.sort_order !== null) return -1
        if (b.sort_order !== null) return 1
        return a.name.localeCompare(b.name)
      })
      setCategories(sortedCategories)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar las categorías"
      setError(errorMessage)
      console.error("Error fetching categories:", err)
    } finally {
      setLoading(false)
    }
  }

  const addCategory = async (categoryData: CreateCategoryRequest) => {
    setLoading(true)
    setError(null)
    try {
      const newCategory = await createCategoryAPI(categoryData as Category)
      setCategories((prev) => {
        const updated = [...prev, newCategory]
        return updated.sort((a, b) => {
          if (a.sort_order !== null && b.sort_order !== null) {
            return a.sort_order - b.sort_order
          }
          if (a.sort_order !== null) return -1
          if (b.sort_order !== null) return 1
          return a.name.localeCompare(b.name)
        })
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear la categoría"
      enqueueSnackbar(errorMessage, { variant: "error" });
      setError(errorMessage)
      throw err
    } finally {
      fetchCategories()
      setLoading(false)
             enqueueSnackbar("Categoría creada exitosamente", { variant: "success" });
    }
  }

  const updateCategory = async (id: number, categoryData: UpdateCategoryRequest) => {
    
    setError(null)
    try {
      const updated = await updateCategoryAPI({ ...categoryData, id })
      setCategories((prev) => {
        const updatedList = prev.map((cat) => (cat.id === id ? updated : cat))
        return updatedList.sort((a, b) => {
          if (a.sort_order !== null && b.sort_order !== null) {
            return a.sort_order - b.sort_order
          }
          if (a.sort_order !== null) return -1
          if (b.sort_order !== null) return 1
          return a.name.localeCompare(b.name)
        })
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar la categoría"
      setError(errorMessage)
       enqueueSnackbar(errorMessage, { variant: "error" });
      throw err
    } finally {
      fetchCategories()
       enqueueSnackbar("Categoría actualizada exitosamente", { variant: "success" });
      setLoading(false)
    }
  }

  const deleteCategory = async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      await deleteCategoryAPI(id)
      setCategories((prev) => prev.filter((cat) => cat.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar la categoría"
      enqueueSnackbar(errorMessage, { variant: "error" });
      setError(errorMessage)
      throw err
    } finally {
      fetchCategories()
      enqueueSnackbar("Categoría eliminada exitosamente", { variant: "success" });
      setLoading(false)
    }
  }

  const getCategoryById = (id: number) => {
    return categories.find((cat) => cat.id === id)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        error,
        fetchCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryById,
      }}
    >
      {children}
    </CategoryContext.Provider>
  )
}

export function useCategories() {
  const context = useContext(CategoryContext)
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoryProvider")
  }
  return context
}
