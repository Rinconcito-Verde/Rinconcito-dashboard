import { createContext, useContext, useState, useEffect } from "react";
import { getCategories, getPackages, createPackage, updatePackage, deletePackage } from "../services/packageApi";
import { useSnackbar } from "notistack";

const ProductsContext = createContext(undefined);

export const useProductsContext = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProductsContext must be used within a ProductsProvider");
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar(); // Notificaciones con notistack
  const [categories, setCategories] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
    const loadData = async () => {
      try {
        setError(null);
        const [categoriesData, packagesData] = await Promise.all([getCategories(), getPackages()]);
        setCategories(categoriesData);
        setPackages(packagesData);
      } catch (error) {
        setError(error.message);
        enqueueSnackbar("Error al cargar los datos: "+error.message, { variant: "error" });
      }
    };
  useEffect(() => {
    loadData();
  }, []);

  // **Crear un paquete**
  const addPackage = async (token: string, packageData: any) => {
    setLoading(true);
    try {
      const newPackage = await createPackage(token, packageData);
      enqueueSnackbar("Paquete creado exitosamente", { variant: "success" });
      return newPackage;
    } catch (error) {
      enqueueSnackbar("Error al crear el paquete:" +error.message, { variant: "error" });
      throw error;
    } finally {
      setLoading(false);
      loadData();
    }
  };

  // **Actualizar un paquete**
  const editPackage = async (id: number, packageData: any) => {
    setLoading(true);
    try {
      const updatedPackage = await updatePackage(id, packageData);
      enqueueSnackbar("Paquete actualizado correctamente", { variant: "success" });
      return updatedPackage;
    } catch (error) {
      enqueueSnackbar("Error al actualizar el paquete: "+error.message, { variant: "error" });
      throw error;
    } finally {
      setLoading(false);
      loadData();
    }
  };

  // **Eliminar un paquete**
  const removePackage = async (token: string, id: number) => {
    setLoading(true);
    try {
      await deletePackage(token, id);
      enqueueSnackbar("Paquete eliminado correctamente", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Error al eliminar el paquete: "+error.message, { variant: "error" });
      throw error;
    } finally {
      setLoading(false);
      loadData();
    }
  };

  return (
    <ProductsContext.Provider
      value={{ 
        categories, 
        packages, 
        error, 
        loading, 
        addPackage, 
        editPackage, 
        removePackage 
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};
