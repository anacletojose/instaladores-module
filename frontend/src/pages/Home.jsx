import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function Home() {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Bienvenido</h1>
      <p className="text-gray-500 mb-8">
        Ingresá o registrate para continuar
      </p>
      <div className="flex flex-col gap-4">
        <Link to="/login">
          <Button text="Iniciar sesión" color="blue" />
        </Link>
        <Link to="/register">
          <Button text="Registrarse" color="indigo" />
        </Link>
      </div>
    </div>
  );
}
