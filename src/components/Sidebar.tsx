"use client"

import type React from "react"

import { Package, BarChart, Settings, Users, LogOut, X } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { username, logout } = useAuth()

  // Close sidebar when pressing Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEscape)

    // Prevent scrolling when sidebar is open on mobile
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      window.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  // Handle backdrop click to close sidebar
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={handleBackdropClick} />}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transition-transform duration-200 ease-in-out
        lg:transform-none lg:static lg:z-auto lg:block
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 justify-between">
            <a href="/" className="flex items-center gap-2 font-semibold">
              <Package className="h-6 w-6" />
              <span>ZUROS NETWORK</span>
            </a>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
              <X className="h-4 w-4" />
              <span className="sr-only">Cerrar menú</span>
            </Button>
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

            <div className="border-t p-4">
              <div className="mb-2">
                <p className="font-medium text-sm">{username}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-muted-foreground hover:text-destructive hover:border-destructive"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar sesión
              </Button>
            </div>

        </div>
      </div>
    </>
  )
}

