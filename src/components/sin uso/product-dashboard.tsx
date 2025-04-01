"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import {
  Plus,
  Search,
  X,
  Edit,
  Trash,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Package,
  BarChart,
  Settings,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

// ==================== INTERFACES ====================

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  image?: string
  commands: Command[]
}

export interface Command {
  id: string
  name: string
  description: string
  syntax?: string
}

// ==================== DASHBOARD COMPONENT ====================

export function Dashboard() {
  const [isCreating, setIsCreating] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const handleCreateClick = () => {
    setIsCreating(true)
    setEditingProduct(null)
  }

  const handleEditClick = (product: Product) => {
    setIsCreating(false)
    setEditingProduct(product)
  }

  const handleFormClose = () => {
    setIsCreating(false)
    setEditingProduct(null)
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1">
        <header className="border-b">
          <div className="flex h-16 items-center px-4 gap-4">
            <h1 className="text-lg font-semibold">Productos</h1>
            <div className="ml-auto flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar productos..."
                  className="w-[200px] pl-8 md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={handleCreateClick}>
                <Plus className="mr-2 h-4 w-4" />
                Crear Producto
              </Button>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6">
          {isCreating || editingProduct ? (
            <ProductForm product={editingProduct} onClose={handleFormClose} isCreating={isCreating} />
          ) : (
            <CategoryProductList onEditClick={handleEditClick} searchQuery={searchQuery} />
          )}
        </main>
      </div>
    </div>
  )
}

// ==================== SIDEBAR COMPONENT ====================

function Sidebar() {
  return (
    <div className="hidden border-r bg-muted/40 lg:block w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4">
          <a href="/" className="flex items-center gap-2 font-semibold">
            <Package className="h-6 w-6" />
            <span>ZUROS NETWORK</span>
          </a>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg bg-accent px-3 py-2 text-accent-foreground transition-all"
            >
              <Package className="h-4 w-4" />
              Productos
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            >
              <Users className="h-4 w-4" />
              Compras
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            >
              <BarChart className="h-4 w-4" />
              Estadísticas
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
              Configuración
            </a>
          </nav>
        </div>
      </div>
    </div>
  )
}

// ==================== PRODUCT FORM COMPONENT ====================

interface ProductFormProps {
  product: Product | null
  onClose: () => void
  isCreating: boolean
}

// Available categories
const CATEGORIES = ["Ropa", "Calzado", "Electrónica", "Accesorios", "Hogar"]

function ProductForm({ product, onClose, isCreating }: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    commands: [],
  })

  const [showCommandModal, setShowCommandModal] = useState(false)
  const [currentCommand, setCurrentCommand] = useState<{
    index: number | null
    command: Partial<Command>
  }>({
    index: null,
    command: { id: "", name: "", description: "", syntax: "" },
  })

  useEffect(() => {
    if (product) {
      // Si la descripción contiene HTML, extraer solo el texto
      let description = product.description
      if (description.includes("<")) {
        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = description
        description = tempDiv.textContent || tempDiv.innerText || description
      }

      setFormData({
        ...product,
        description,
      })
    }
  }, [product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "price" || name === "stock" ? Number.parseFloat(value) : value,
    })
  }

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
    })
  }

  const handleAddCommand = () => {
    setCurrentCommand({
      index: null,
      command: { id: crypto.randomUUID(), name: "", description: "", syntax: "" },
    })
    setShowCommandModal(true)
  }

  const handleEditCommand = (index: number) => {
    setCurrentCommand({
      index,
      command: { ...formData.commands![index] },
    })
    setShowCommandModal(true)
  }

  const handleDeleteCommand = (index: number) => {
    const newCommands = [...(formData.commands || [])]
    newCommands.splice(index, 1)
    setFormData({
      ...formData,
      commands: newCommands,
    })
  }

  const handleSaveCommand = () => {
    const newCommands = [...(formData.commands || [])]

    if (currentCommand.index !== null) {
      // Edit existing command
      newCommands[currentCommand.index] = currentCommand.command as Command
    } else {
      // Add new command
      newCommands.push(currentCommand.command as Command)
    }

    setFormData({
      ...formData,
      commands: newCommands,
    })

    setShowCommandModal(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the data to your backend
    console.log("Form submitted:", formData)
    onClose()
  }

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
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Producto</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Escribe la descripción del producto..."
              className="min-h-[200px] resize-y"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Precio (€)</Label>
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
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
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

          {/* Commands Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Comandos</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddCommand}>
                <Plus className="h-4 w-4 mr-1" /> Agregar Comando
              </Button>
            </div>

            {formData.commands && formData.commands.length > 0 ? (
              <div className="border rounded-md divide-y">
                {formData.commands.map((command, index) => (
                  <div key={command.id || index} className="p-3 flex items-start justify-between">
                    <div>
                      <div className="font-medium">{command.name}</div>
                      <div className="text-sm text-muted-foreground">{command.description}</div>
                      {command.syntax && <code className="text-xs bg-muted px-1 py-0.5 rounded">{command.syntax}</code>}
                    </div>
                    <div className="flex gap-1">
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleEditCommand(index)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleDeleteCommand(index)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border rounded-md p-3 text-center text-muted-foreground text-sm">
                No hay comandos. Agrega uno para comenzar.
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">{isCreating ? "Crear Producto" : "Guardar Cambios"}</Button>
        </CardFooter>
      </form>

      {/* Command Modal */}
      {showCommandModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              {currentCommand.index !== null ? "Editar Comando" : "Agregar Comando"}
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="command-name">Nombre</Label>
                <Input
                  id="command-name"
                  value={currentCommand.command.name}
                  onChange={(e) =>
                    setCurrentCommand({
                      ...currentCommand,
                      command: { ...currentCommand.command, name: e.target.value },
                    })
                  }
                  placeholder="Nombre del comando"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="command-description">Descripción</Label>
                <Input
                  id="command-description"
                  value={currentCommand.command.description}
                  onChange={(e) =>
                    setCurrentCommand({
                      ...currentCommand,
                      command: { ...currentCommand.command, description: e.target.value },
                    })
                  }
                  placeholder="Descripción del comando"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="command-syntax">Sintaxis (opcional)</Label>
                <Input
                  id="command-syntax"
                  value={currentCommand.command.syntax || ""}
                  onChange={(e) =>
                    setCurrentCommand({
                      ...currentCommand,
                      command: { ...currentCommand.command, syntax: e.target.value },
                    })
                  }
                  placeholder="/comando"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={() => setShowCommandModal(false)}>
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleSaveCommand}
                disabled={!currentCommand.command.name || !currentCommand.command.description}
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

// ==================== PRODUCT TABLE COMPONENT ====================

interface ProductTableProps {
  products: Product[]
  onEditClick: (product: Product) => void
}

function ProductTable({ products, onEditClick }: ProductTableProps) {
  const [localProducts, setLocalProducts] = useState<Product[]>(products)

  const handleDeleteClick = (productId: string) => {
    setLocalProducts(localProducts.filter((product) => product.id !== productId))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  // Function to safely truncate text
  const truncateText = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <div className="rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead className="hidden md:table-cell">Descripción</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="hidden lg:table-cell">Comandos</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="max-w-xs text-sm text-muted-foreground">{truncateText(product.description)}</div>
              </TableCell>
              <TableCell>{formatPrice(product.price)}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell className="hidden lg:table-cell">
                <CommandList commands={product.commands} />
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Abrir menú</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditClick(product)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteClick(product.id)}>
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
  )
}

// ==================== COMMAND LIST COMPONENT ====================

interface CommandListProps {
  commands: Command[]
  maxDisplay?: number
}

function CommandList({ commands, maxDisplay = 3 }: CommandListProps) {
  if (!commands || commands.length === 0) {
    return <span className="text-muted-foreground text-xs">Sin comandos</span>
  }

  return (
    <div className="flex flex-wrap gap-1">
      {commands.slice(0, maxDisplay).map((command) => (
        <Badge key={command.id} variant="secondary" className="text-xs">
          {command.syntax || command.name}
        </Badge>
      ))}
      {commands.length > maxDisplay && (
        <Badge variant="outline" className="text-xs">
          +{commands.length - maxDisplay} más
        </Badge>
      )}
    </div>
  )
}

// ==================== CATEGORY PRODUCT LIST COMPONENT ====================

interface CategoryProductListProps {
  onEditClick: (product: Product) => void
  searchQuery: string
}

// Sample data - in a real app, this would come from an API
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Camiseta Básica",
    description: "<p>Camiseta de algodón de <strong>alta calidad</strong> con diseño moderno.</p>",
    price: 19.99,
    stock: 50,
    category: "Ropa",
    commands: [
      {
        id: "cmd1",
        name: "Lavar",
        description: "Lavar a máquina a 30°C",
        syntax: "/lavar",
      },
      {
        id: "cmd2",
        name: "Planchar",
        description: "Planchar a temperatura media",
        syntax: "/planchar",
      },
    ],
  },
  {
    id: "2",
    name: "Pantalón Vaquero",
    description: "<p>Pantalón vaquero clásico con <em>estilo atemporal</em> y gran durabilidad.</p>",
    price: 49.99,
    stock: 30,
    category: "Ropa",
    commands: [
      {
        id: "cmd3",
        name: "Lavar",
        description: "Lavar a máquina a 40°C",
        syntax: "/lavar",
      },
    ],
  },
  {
    id: "3",
    name: "Zapatillas Deportivas",
    description: "<p>Zapatillas para running con <ul><li>Suela amortiguada</li><li>Tejido transpirable</li></ul></p>",
    price: 89.99,
    stock: 15,
    category: "Calzado",
    commands: [],
  },
  {
    id: "4",
    name: "Reloj Inteligente",
    description:
      "<p>Smartwatch con múltiples funciones como <strong>monitoreo cardíaco</strong> y <strong>GPS integrado</strong>.</p>",
    price: 129.99,
    stock: 10,
    category: "Electrónica",
    commands: [
      {
        id: "cmd4",
        name: "Reiniciar",
        description: "Reinicia el dispositivo",
        syntax: "/reiniciar",
      },
      {
        id: "cmd5",
        name: "Actualizar",
        description: "Actualiza el firmware",
        syntax: "/actualizar",
      },
      {
        id: "cmd6",
        name: "Sincronizar",
        description: "Sincroniza con el teléfono",
        syntax: "/sincronizar",
      },
    ],
  },
  {
    id: "5",
    name: "Bolso de Cuero",
    description: "<p>Bolso de cuero genuino con <em>acabados premium</em> y compartimentos múltiples.</p>",
    price: 79.99,
    stock: 20,
    category: "Accesorios",
    commands: [],
  },
  {
    id: "6",
    name: "Smartphone",
    description:
      "<p>Teléfono inteligente con <strong>cámara de alta resolución</strong> y batería de larga duración.</p>",
    price: 399.99,
    stock: 8,
    category: "Electrónica",
    commands: [
      {
        id: "cmd7",
        name: "Reiniciar",
        description: "Reinicia el dispositivo",
        syntax: "/reiniciar",
      },
    ],
  },
  {
    id: "7",
    name: "Chaqueta de Invierno",
    description: "<p>Chaqueta térmica con <em>aislamiento avanzado</em> para climas fríos.</p>",
    price: 89.99,
    stock: 25,
    category: "Ropa",
    commands: [],
  },
  {
    id: "8",
    name: "Lámpara de Mesa",
    description: "<p>Lámpara moderna con <strong>luz LED ajustable</strong> y diseño minimalista.</p>",
    price: 45.99,
    stock: 18,
    category: "Hogar",
    commands: [],
  },
]

function CategoryProductList({ onEditClick, searchQuery }: CategoryProductListProps) {
  const [products] = useState<Product[]>(sampleProducts)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  // Group products by category and filter by search query
  const categorizedProducts = useMemo(() => {
    const filtered = searchQuery
      ? products.filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : products

    // Group by category
    return filtered.reduce(
      (acc, product) => {
        const category = product.category
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(product)
        return acc
      },
      {} as Record<string, Product[]>,
    )
  }, [products, searchQuery])

  // Initialize expanded state for all categories if not set
  useMemo(() => {
    const categories = Object.keys(categorizedProducts)
    const newExpandedState = { ...expandedCategories }

    categories.forEach((category) => {
      if (newExpandedState[category] === undefined) {
        // Default to expanded
        newExpandedState[category] = true
      }
    })

    if (Object.keys(newExpandedState).length !== Object.keys(expandedCategories).length) {
      setExpandedCategories(newExpandedState)
    }
  }, [categorizedProducts, expandedCategories])

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  // Sort categories alphabetically
  const sortedCategories = Object.keys(categorizedProducts).sort()

  if (sortedCategories.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No se encontraron productos que coincidan con tu búsqueda.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {sortedCategories.map((category) => (
        <div key={category} className="border rounded-md overflow-hidden">
          <div
            className="bg-muted/40 px-4 py-3 flex items-center justify-between cursor-pointer"
            onClick={() => toggleCategory(category)}
          >
            <h2 className="text-lg font-medium flex items-center">
              {expandedCategories[category] ? (
                <ChevronDown className="h-5 w-5 mr-2" />
              ) : (
                <ChevronRight className="h-5 w-5 mr-2" />
              )}
              {category}
              <span className="ml-2 text-sm text-muted-foreground">
                ({categorizedProducts[category].length} productos)
              </span>
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                toggleCategory(category)
              }}
            >
              {expandedCategories[category] ? "Ocultar" : "Mostrar"}
            </Button>
          </div>

          {expandedCategories[category] && (
            <ProductTable products={categorizedProducts[category]} onEditClick={onEditClick} />
          )}
        </div>
      ))}
    </div>
  )
}

