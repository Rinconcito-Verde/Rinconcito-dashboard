import { Suspense, lazy } from "react";
import { Login } from "@/components/Login";
import { useAuth } from "@/context/AuthContext";
const Layout = lazy(() => import("./Layout/Layout"));
export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <Suspense fallback={<div className="text-center mt-10">Cargando dashboard...</div>}>
          
          <Layout />
        </Suspense>
      ) : (
        <Login />
      )}
    </>
  );
}
