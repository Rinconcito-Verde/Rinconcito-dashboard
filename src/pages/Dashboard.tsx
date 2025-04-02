import { useState, useEffect } from "react"
import { Menu, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/Sidebar"
import { ProductForm } from "@/components/ProductForm"
import { CategoryProductList } from "@/components/CategoryProductList"
import type { Product } from "@/components/types"
import { useProductsContext } from "../context/ProductsContext"
import { AddPackageMenu } from "../components/AddPackageMenu"
import { useMainContent } from "../context/MainContentContext"

export function Dashboard() {
  const { editPackage, removePackage } = useProductsContext()
  const { mainContent, setMainContent} = useMainContent()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Set initial content when component mounts
  useEffect(() => {
    setMainContent(
      <CategoryProductList onEditClick={handleEditClick} onRemoveClick={removePackage} />
    )
  }, []) // Only run once, after initial render

  function handleCreateClick() {
    setMainContent(<AddPackageMenu onClose={handleFormClose} />)
  }

  function handleEditClick(product: Product) {
    setMainContent(
      <ProductForm product={product} onClose={handleFormClose} onSubmit={editPackage} />
    )
  }

  function handleFormClose() {
    setMainContent(
      <CategoryProductList onEditClick={handleEditClick} onRemoveClick={removePackage} />
    )
  }

  function toggleSidebar() {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <>
      <div className="flex min-h-screen max-h-screen overflow-hidden bg-white">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onPackageClick={()=>setMainContent(
      <CategoryProductList onEditClick={handleEditClick} onRemoveClick={removePackage} />
    )}/>
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
                  Agregar Producto
                </Button>
              </div>
            </div>
          </header>
          <main className="p-4 md:p-6 max-h-[99%] overflow-auto">
            {mainContent}
            <p className="mb-28"></p>
          </main>
        </div>
      </div>
    </>
  )
}
