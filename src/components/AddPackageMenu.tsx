"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useProductsContext } from "@/context/ProductsContext";

const API_BASE_URL = "https://headless.tebex.io/api/accounts";
const tebexToken = "l9j9-cf13199dfe8cadbcdbb253df6ad3b7c001042512";

export function AddPackageMenu({ onClose }: { onClose: () => void }) {
  const { packages, addPackage } = useProductsContext();
  const [apiPackages, setApiPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/${tebexToken}/packages`);
        if (!response.ok) throw new Error("Error al obtener los paquetes");
        const data = await response.json();
        setApiPackages(data.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  if (loading) return <p className="text-center p-4 text-white">Cargando paquetes...</p>;
  if (error) return <p className="text-center p-4 text-red-500">Error: {error}</p>;

  // Filtrar paquetes que no estén en el contexto
  const filteredPackages = apiPackages.filter((pkg) => !packages.some((p) => p.id === pkg.id));

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Agregar Paquetes disponibles en tebex</h2>
      <Button variant="outline" className="mb-4" onClick={onClose}>
        Volver
      </Button>
      {filteredPackages.length > 0 ? (
        <ul className="space-y-2">
          {filteredPackages.map((pkg) => (
           <li key={pkg.id} className="flex justify-between items-center p-3 border rounded">
  <span>{pkg.name}</span>
  <Button
    variant="primary"
    onClick={() => {
      console.log("Paquete seleccionado:", pkg);
      addPackage(pkg);
    }}
  >
    Agregar
  </Button>
</li>

          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Todos los paquetes están agregados</p>
      )}
    </div>
  );
}