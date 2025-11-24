import React, { useState, useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';


export default function Register() {
    const navigate = useNavigate();
  return (
    <>
      <header style={{ backgroundColor: '#007bff', color: 'white', padding: '15px', textAlign: 'center', marginBottom: '30px' }}>
                          <h1>🧠 App de gestion de estudio personalizado</h1>
                          
                        </header>
        
   
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 text-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Registrá los datos de tu cuenta</h2>
        <div className= "nombre">
            <label htmlFor="Nombre completo"
            style={{ fontWeight: 'bold',
            display: 'block',
            marginBottom: '5px' }}
            >Nombre completo
            </label>
            <input
          type="text"
          placeholder="Nombre completo"
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
        <div className= "email">
            <label htmlFor="Correo electrónico"
            style={{ fontWeight: 'bold',
            display: 'block',
            marginTop: '12px',
            marginBottom: '5px' }}
            >Correo electrónico
            </label>
            <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full mb-4 p-3 border rounded-xl"
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
        <label htmlFor="Contraseña"
            style={{ fontWeight: 'bold',
            display: 'block',
            marginBottom: '5px' }}
            >Contraseña
            </label>
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
  


        <Link to="/Login" className="text-sm text-blue-600 hover:underline">
          ¿Ya tenés cuenta? Inicia sesión
        </Link>
      </div>
    </div>
    </>

  );
}
