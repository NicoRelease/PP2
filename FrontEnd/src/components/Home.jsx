import { useNavigate } from 'react-router-dom';


export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 text-center">
      <img
        src="../src/assets/Home.jpg"
        alt="Imagen Home"
        className="rounded-2xl shadow-lg mb-6"
      />

      <h1 className="text-3xl font-bold mb-4">Bienvenido a la Aplicación de estudio</h1>
      <p className="text-gray-700 mb-8 max-w-md">
        Esta es la página principal. Puedes ingresar para acceder a tu cuenta.
      </p>

      <button
        onClick={() => navigate("/Login")}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
      >
        Ingresar
      </button>
    </div>
  );
}