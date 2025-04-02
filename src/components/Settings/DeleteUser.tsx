import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthService } from "@/services/authService"; // Asegúrate de tener este servicio creado

export default function DeleteUserForm() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await AuthService.deleteUser(username); // Llamada al servicio para borrar el usuario
      setSuccess(true);
    } catch (err) {
      setError("Hubo un error al intentar eliminar el usuario.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Eliminar Usuario</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">Usuario eliminado con éxito</p>}

        <div>
          <label className="block text-sm font-medium">Nombre de Usuario</label>
          <Input
            type="text"
            name="username"
            value={username}
            onChange={handleChange}
            required
            placeholder="Ingresa el nombre de usuario"
          />
        </div>

        <Button type="submit" className="w-full">Eliminar Usuario</Button>
      </form>
    </div>
  );
}
