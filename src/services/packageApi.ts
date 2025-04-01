const API_BASE_URL: string = import.meta.env.VITE_SHOP_API_URL || "http://localhost:8787/api";

interface FetchOptions extends RequestInit {} // Permite opciones adicionales en la solicitud

async function fetchData<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Fetch error (${endpoint}):`, (error as Error).message);
    throw error;
  }
}

// Definimos los tipos de datos esperados
export interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  sort_order: number;
}

export interface Package {
  id: number;
  name: string;
  description: string;
  short_description?: string | null;
  base_price: number;
  total_price: number;
  discount: number;
  sales_tax: number;
  currency: string;
  sort_order: number;
  image: string;
  type: string;
  expiration_date?: string | null;
  created_at?: string | null;
  updated_at?: string;
  category_id: number;
}

// Funciones para obtener datos
export const getCategories = (): Promise<Category[]> => fetchData<Category[]>("/categories");

export const getPackages = (): Promise<Package[]> => fetchData<Package[]>("/packages");
