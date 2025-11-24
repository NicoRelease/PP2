import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from './components/Home';
import SessionForm from './components/SessionForm';
import GestorEstudio from './components/GestorEstudio';
import TareaManager from './components/TareaManager';
import SessionDetail from './components/SessionDetail';

function App() {
  return (
    <Router>
      <div className="app-container" style={{ fontFamily: 'Arial, sans-serif' }}>
        
        <header style={{ backgroundColor: '#007bff', color: 'white', padding: '15px', textAlign: 'center' }}>
          <h1>🧠 LMS de Estudio Personalizado</h1>

          <nav style={{ marginTop: '10px' }}>
            <Link to="/" style={{ color: 'white', margin: '0 20px', textDecoration: 'none', fontWeight: 'bold' }}>
              🏠 Inicio
            </Link>
            <Link to="/crear-sesion" style={{ color: 'white', margin: '0 20px', textDecoration: 'none', fontWeight: 'bold' }}>
              ✍️ Planificar Sesión
            </Link>
            <Link to="/gestor-estudio" style={{ color: 'white', margin: '0 20px', textDecoration: 'none', fontWeight: 'bold' }}>
              📊 Gestor de Estudio
            </Link>
          </nav>
        </header>

        <main style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/crear-sesion" element={<SessionForm />} />
            <Route path="/gestor-estudio" element={<GestorEstudio />} />
            <Route path="/tareas/:tareaId" element={<TareaManager />} />
            <Route path="/session/:id" element={<SessionDetail />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;
