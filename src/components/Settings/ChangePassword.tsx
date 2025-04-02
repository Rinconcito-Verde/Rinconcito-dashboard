import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthService } from "@/services/authService";

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    username: "",
    oldPassword: "",
    newPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await AuthService.changePassword(formData.username, formData.oldPassword, formData.newPassword); // Llamada al servicio para cambiar la contraseña
      setSuccess(true);
    } catch (err:any) {
      setError("Hubo un error al cambiar la contraseña:" + err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Cambiar Contraseña</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">Contraseña cambiada con éxito</p>}

        <div>
          <label className="block text-sm font-medium">Nombre de Usuario</label>
          <Input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Ingresa tu nombre de usuario"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Contraseña Actual</label>
          <Input
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            required
            placeholder="Ingresa tu contraseña actual"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Nueva Contraseña</label>
          <Input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            minLength={8}
            placeholder="Ingresa tu nueva contraseña"
          />
        </div>

        <Button type="submit" className="w-full">Cambiar Contraseña</Button>
      </form>
    </div>
  );
}
