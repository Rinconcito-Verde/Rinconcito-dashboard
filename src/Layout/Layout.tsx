import { ProductsProvider } from "../context/ProductsContext";
import { Dashboard } from "../pages/Dashboard";


export default function Layout() {
  return (
    <ProductsProvider>
     
      <Dashboard />
    </ProductsProvider>
  );
}
