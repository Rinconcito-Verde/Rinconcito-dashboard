const API_BASE_URL: string = import.meta.env.VITE_SHOP_API_URL || "http://localhost:8787/api";
import { Package, Category } from "../types/types";

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

export const getCategories = (): Promise<Category[]> => fetchData("/categories");
// Obtener todos los paquetes
export const getPackages = (): Promise<Package[]> => fetchData<Package[]>("/products");

// Obtener un paquete por ID
export const getPackageById = (id: number): Promise<Package> => fetchData<Package>(`/products/${id}`);

export const createPackage = (packageData: Package): Promise<Package> => {
  const formattedPackageData = {
    ...packageData
  };

  return fetchData<Package>("/products", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(formattedPackageData),
  });
};


export const updatePackage = (packageData: Partial<Package>): Promise<Package> => {
  return fetchData<Package>(`/products/${packageData.id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(packageData),
  });
};

// Eliminar un paquete por ID (requiere autenticación)
export const deletePackage = (id: number): Promise<{ success: boolean; message: string }> => {
  return fetchData<{ success: boolean; message: string }>(`/products/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
};









export const createCategory = (categoryData: Category): Promise<Category> => {
  const formattedPackageData = {
    ...categoryData
  };

  return fetchData<Category>("/categories", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(formattedPackageData),
  });
};


export const updateCategory = (categoryData: Partial<Category>): Promise<Category> => {
  return fetchData<Category>(`/categories/${categoryData.id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(categoryData),
  });
};


export const deleteCategory = (id: number): Promise<{ success: boolean; message: string }> => {
  return fetchData<{ success: boolean; message: string }>(`/categories/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
};

