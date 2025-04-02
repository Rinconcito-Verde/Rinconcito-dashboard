import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ProductForm } from "@/components/ProductForm";
import { CategoryProductList } from "@/components/CategoryProductList";
import type { Product } from "@/components/types";
import { useProductsContext } from "../context/ProductsContext";
import { AddPackageMenu } from "../components/AddPackageMenu";
import { Header } from "../components/Nav/Header";
import { Settings } from "../components/Settings/Settings";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { ProductsProvider } from "../context/ProductsContext";

function LayoutContent() {
  const { removePackage } = useProductsContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  function handleCreateClick() {
    navigate("/add");
  }

  function handleEditClick(product: Product) {
    navigate(`/edit/${product.id}`);
  }

  function handleFormClose() {
    navigate("/");
  }

  function toggleSidebar() {
    setSidebarOpen(!sidebarOpen);
  }

  return (
    <div className="flex min-h-screen max-h-screen overflow-hidden bg-white">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1">
        <Header toggleSidebar={toggleSidebar} handleCreateClick={handleCreateClick} />
        <main className="p-4 md:p-6 max-h-[99%] overflow-auto">
          <Routes>
            <Route path="/" element={<CategoryProductList onEditClick={handleEditClick} onRemoveClick={removePackage} />} />
            <Route path="/edit/:productId" element={<ProductForm isCreating={false} />} />
            <Route path="/add" element={<AddPackageMenu onClose={handleFormClose} />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/sales" element={<p>Próximamente</p>} />
            <Route path="/stats" element={<p>Próximamente</p>} />
          </Routes>
          <p className="mb-28"></p>
        </main>
      </div>
    </div>
  );
}

export default function Layout() {
  return (
    <SnackbarProvider>
      <ProductsProvider>
        <Router>
          <LayoutContent />
        </Router>
      </ProductsProvider>
    </SnackbarProvider>
  );
}
