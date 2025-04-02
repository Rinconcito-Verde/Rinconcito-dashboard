import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthService } from "@/services/authService";

export default function RegisterForm() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<boolean | null>(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.username.length < 3) {
      setError("El nombre de usuario debe tener al menos 3 caracteres.");
      return;
    }

    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    try {
      const response = await AuthService.register(formData.username, formData.password);
      if (!response) {
        setError("Error en el registro. Inténtalo de nuevo.");
        setSuccess(false);
      } else {
        setSuccess(!!response);
      }
    } catch (err) {
      setError("Error en el servidor. Inténtalo más tarde.");
      setSuccess(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Registro</h2>
      {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
      {success && <p className="text-green-500 text-sm">Usuario registrado con éxito</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Usuario</label>
          <Input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Ingresa tu usuario"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Contraseña</label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Ingresa tu contraseña"
          />
        </div>
        <Button type="submit" className="w-full">Registrarse</Button>
      </form>
    </div>
  );
}
