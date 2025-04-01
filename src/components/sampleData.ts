import type { Product } from "./types"

// Sample data - in a real app, this would come from an API
export const sampleProducts: Product[] = [
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

// Available categories
export const CATEGORIES = ["Ropa", "Calzado", "Electrónica", "Accesorios", "Hogar"]

