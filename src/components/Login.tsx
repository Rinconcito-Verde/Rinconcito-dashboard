import { useState } from "react";
import { Package, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const success = await login(username, password);
      if (!success) {
        setError("Credenciales inválidas. Por favor, inténtalo de nuevo.");
      }
    } catch (err) {
      setError("Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.");
      console.error("Login error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <img src="https://zuros.xyz/icon3.png" className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-cyan-500">ZUROS <span className="text-pink-400">NETWORK</span></CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="Pablitotototo"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <a href="#" onClick={() => alert("Jaja que estupido como vas a olvidar tu contraseña 😂")} className="text-sm text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">{showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
