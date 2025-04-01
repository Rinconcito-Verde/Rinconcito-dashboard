import React, { createContext, useContext, useState, useEffect } from "react";
import { getCategories, getPackages } from "../services/packageApi";

// Definimos los tipos para los estados
interface ProductContextType {
  categories: any[]; // Cambia este tipo según los datos reales que devuelven las categorías
  packages: any[]; // Cambia 'any' al tipo real de un paquete
  error: string | null;
}

const ProductsContext = createContext<ProductContextType | undefined>(undefined);

export const useProductsContext = (): ProductContextType => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProductsContext must be used within a ProductsProvider");
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        const [categoriesData, packagesData] = await Promise.all([getCategories(), getPackages()]);
        setCategories(categoriesData);
        setPackages(packagesData);
      } catch (error) {
        setError(error.message);
      }
    };
    loadData();
  }, []);

  return (
    <ProductsContext.Provider value={{ categories, packages, error }}>
      {children}
    </ProductsContext.Provider>
  );
};
