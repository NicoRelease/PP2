// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SessionForm from './components/SessionForm';
import GestorEstudio from './components/GestorEstudio'; // ✅ Nuevo componente principal
import TareaManager from './components/TareaManager';
import SessionDetail from './components/SessionDetail';
import './App.css';

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
            <Link to="/gestionar-sesion" style={{ color: 'white', margin: '0 20px', textDecoration: 'none', fontWeight: 'bold' }}>
              ⚙️ Gestionar Tarea
            </Link>
          </nav>
        </header>
        
        <main style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<SessionForm />} />
            <Route path="/gestor-estudio" element={<GestorEstudio />} /> {/* ✅ Nueva ruta */}
            <Route path="/gestionar-sesion/:sessionId?" element={<TareaManager />} />
            <Route path="/session/:id" element={<SessionDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
