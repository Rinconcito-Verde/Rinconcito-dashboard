const API_BASE_URL: string = import.meta.env.VITE_SHOP_API_URL || "http://localhost:8787/api";
import { Package } from "../types/types";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

async function fetchData<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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

export const getCategories = () => fetchData("/categories");
// Obtener todos los paquetes
export const getPackages = (): Promise<Package[]> => fetchData<Package[]>("/packages");

// Obtener un paquete por ID
export const getPackageById = (id: number): Promise<Package> => fetchData<Package>(`/packages/${id}`);

export const createPackage = (packageData: Package): Promise<Package> => {
  const formattedPackageData = {
    ...packageData,
    short_description: " ", // Asegurar que tenga una descripción
    sort_order: packageData.order, // Asegurar un orden válido
    category_id: packageData.category.id, // Asegurar una categoría válida
  };

  return fetchData<Package>("/packages", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(formattedPackageData),
  });
};


export const updatePackage = (packageData: Partial<Package>): Promise<Package> => {
  return fetchData<Package>(`/packages/${packageData.id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(packageData),
  });
};

// Eliminar un paquete por ID (requiere autenticación)
export const deletePackage = (id: number): Promise<{ success: boolean; message: string }> => {
  return fetchData<{ success: boolean; message: string }>(`/packages/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
};
