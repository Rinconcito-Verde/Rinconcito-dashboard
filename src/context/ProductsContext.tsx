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
  const { enqueueSnackbar } = useSnackbar();
  const [categories, setCategories] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [productMock, setPackagesMock] = useState<any>({
    name: '',
    slug: '',
    description: '',
    short_description: '',
    price: 0,
    discount: 0,
    sales_tax: 0,
    currency: 'USD',
    sort_order: 1,
    image: ' ',
    type: ' ',
    expiration_date: null,
    category_id: 1
  });
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
      enqueueSnackbar("Error al cargar los datos: " + error.message, { variant: "error" });
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  // **Crear un paquete**
  const addPackage = async (packageData: any) => {
    setLoading(true);
    try {
      const newPackage = await createPackage(packageData);
      enqueueSnackbar("Paquete creado exitosamente", { variant: "success" });
      return newPackage;
    } catch (error) {
      enqueueSnackbar("Error al crear el paquete:" + error.message, { variant: "error" });
      throw error;
    } finally {
      setLoading(false);
      loadData();
    }
  };

  // **Actualizar un paquete**
  const editPackage = async (packageData) => {
    setLoading(true);
    try {
      const updatedPackage = await updatePackage(packageData);
      enqueueSnackbar("Paquete actualizado correctamente", { variant: "success" });
      return updatedPackage;
    } catch (error) {
      enqueueSnackbar("Error al actualizar el paquete: " + error.message, { variant: "error" });
      throw error;
    } finally {
      setLoading(false);
      loadData();
    }
  };

  // **Eliminar un paquete**
  const removePackage = async (id: number) => {
    setLoading(true);
    try {
      await deletePackage(id);
      enqueueSnackbar("Paquete eliminado correctamente", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Error al eliminar el paquete: " + error.message, { variant: "error" });
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
        productMock,
        setPackagesMock,
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
