import { useState } from "react"
import { Menu, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/Sidebar"
import { ProductForm } from "@/components/ProductForm"
import { CategoryProductList } from "@/components/CategoryProductList"
import type { Product } from "@/components/types"

export function Dashboard() {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleCreateClick = () => {
    alert("Esta funcion no es compatible con nuestra pasarela de pagos :c")
  }

  const handleEditClick = (product: Product) => {
    setEditingProduct(product)
  }

  const handleFormClose = () => {
    setEditingProduct(null)
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <>
      <div className="flex min-h-screen max-h-screen overflow-hidden bg-white">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1">
          <header className="border-b">
            <div className="flex h-16 items-center px-4 gap-4">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
              <h1 className="text-lg font-semibold">Productos</h1>
              <div className="ml-auto flex items-center gap-4">
                <Button onClick={handleCreateClick}>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Producto
                </Button>
              </div>
            </div>
          </header>
          <main className="p-4 md:p-6 max-h-[99%] overflow-auto">
            {/* Aquí solo el contenido dentro del <main> será desplazable */}
            {editingProduct ? (
              <ProductForm product={editingProduct} onClose={handleFormClose} />
            ) : (
              <CategoryProductList onEditClick={handleEditClick} />
            )}
            <p className="mb-28"></p>
          </main>
        </div>
      </div>
    </>
  )
}
