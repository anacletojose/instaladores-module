import Input from '../components/Input';
import Button from '../components/Button';

export default function Register() {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Crear cuenta</h2>
      <form className="flex flex-col gap-4">
        <Input label="Nombre completo" type="text" placeholder="Juan Pérez" />
        <Input label="Email" type="email" placeholder="ejemplo@correo.com" />
        <Input label="Contraseña" type="password" placeholder="********" />
        <Button text="Registrarse" color="indigo" />
      </form>
    </div>
  );
}

