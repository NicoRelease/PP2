import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// REVERTIDO: Asumiendo que los componentes se encuentran en la carpeta './components' (la estructura original del usuario)
import SessionForm from './components/SessionForm'; 
import GestorEstudio from './components/GestorEstudio'; // ✅ Componente principal
import TareaManager from './components/TareaManager';
import SessionDetail from './components/SessionDetail';
// Nota: Se omite cualquier importación de CSS si no está disponible.

function App() {
  return (
    <Router>
      <div className="app-container" style={{ fontFamily: 'Arial, sans-serif' }}>
        <header style={{ backgroundColor: '#007bff', color: 'white', padding: '15px', textAlign: 'center' }}>
          <h1>🧠 LMS de Estudio Personalizado</h1>
          <nav style={{ marginTop: '10px' }}>
            <Link to="/" style={{ color: 'white', margin: '0 20px', textDecoration: 'none', fontWeight: 'bold' }}>
              ✍️ Planificar Sesión
            </Link>
            <Link to="/gestor-estudio" style={{ color: 'white', margin: '0 20px', textDecoration: 'none', fontWeight: 'bold' }}>
              📊 Gestor de Estudio
            </Link>
          </nav>
        </header>
        
        <main style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<SessionForm />} />
            <Route path="/gestor-estudio" element={<GestorEstudio />} /> {/* Ruta de vista general */}
            
            {/* RUTA DINÁMICA: Coincide con /tareas/69 y usa el parámetro :tareaId */}
            <Route path="/tareas/:tareaId" element={<TareaManager />} />
            
            <Route path="/session/:id" element={<SessionDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;