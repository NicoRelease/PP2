import React, { useState, useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';


export default function Login() {
    const navigate = useNavigate();
  return (
    <>
      
        
   
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 text-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Iniciar Sesión</h2>
        <div className= "email">
            <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full mb-4 p-3 border rounded-xl"
          style={{ 
              width: '20%', 
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
                }} 
            />
        </div>
        <div className="password">
            <input
          type="password"
          placeholder="Contraseña"
          className="w-full mb-6 p-3 border rounded-xl"
          style={{ 
              width: '20%', 
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px',
            marginTop: '12px',
            marginBottom: '12px'
                }} 
        />
        </div>

        

        <button
         onClick={() => navigate("/crear-sesion")}
          className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition mb-4"
          style={{ 
              width: '20%', 
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px',
            marginRight: '12px'
                }} 
        >
          Ingresar
          
        </button>


        <Link to="/Register" className="text-sm text-blue-600 hover:underline">
          ¿No tienes cuenta? Registrate
        </Link>
      </div>
    </div>
    </>

  );
}
