import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductTable } from "./ProductTable";
import type { Product } from "./types";
import { useProductsContext } from "@/context/ProductsContext";

interface CategoryProductListProps {
  onEditClick: (product: Product) => void;
}

export function CategoryProductList({ onEditClick, onRemoveClick}: CategoryProductListProps) {
  const { categories, packages, error } = useProductsContext();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const categorizedProducts = useMemo(() => {
    return packages.reduce((acc, product) => {
      const category = categories.find((c) => c.id === product.category_id)?.name || "Sin categoría";
      if (!acc[category]) acc[category] = [];
      acc[category].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
  }, [packages, categories]);

  useMemo(() => {
    setExpandedCategories((prevState) => {
      const newState = { ...prevState };
      Object.keys(categorizedProducts).forEach((category) => {
        if (newState[category] === undefined) newState[category] = false;
      });
      return newState;
    });
  }, [categorizedProducts]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (Object.keys(categorizedProducts).length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No se encontraron productos que coincidan con tu búsqueda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.keys(categorizedProducts).sort().map((category) => (
        <div key={category} className="border rounded-md overflow-hidden">
          <div
            className="bg-muted/40 px-4 py-3 flex items-center justify-between cursor-pointer"
            onClick={() => toggleCategory(category)}
          >
            <h2 className="text-lg font-medium flex items-center">
              {expandedCategories[category] ? (
                <ChevronDown className="h-5 w-5 mr-2" />
              ) : (
                <ChevronRight className="h-5 w-5 mr-2" />
              )}
              {category}
              <span className="ml-2 text-sm text-muted-foreground">
                ({categorizedProducts[category].length} productos)
              </span>
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                toggleCategory(category);
              }}
            >
              {expandedCategories[category] ? "Ocultar" : "Mostrar"}
            </Button>
          </div>

          {expandedCategories[category] && (
            <ProductTable products={categorizedProducts[category]} onEditClick={onEditClick} onRemoveClick={onRemoveClick} />
          )}
        </div>
      ))}
    </div>
  );
}
