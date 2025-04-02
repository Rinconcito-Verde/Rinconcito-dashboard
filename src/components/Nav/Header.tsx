
import { Menu, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
export function Header({ toggleSidebar, handleCreateClick }) {
  return(
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
  </header>)
}


