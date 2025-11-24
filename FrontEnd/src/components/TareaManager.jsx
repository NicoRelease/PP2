import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Conversion from './Conversion';

const TareaManager = () => {
  const { tareaId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const [tarea, setTarea] = React.useState(null);
  const [sesion, setSesion] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // ⛔ FIX: NO usar tarea.tiempo_real_ejecucion al inicializar (porque todavía no existe)
  const [tiempoTranscurrido, setTiempoTranscurrido] = React.useState(0);

  const [estaActiva, setEstaActiva] = React.useState(false);
  const [intervalId, setIntervalId] = React.useState(null);
  const [modo, setModo] = React.useState('tarea-especifica');

  const API_BASE_URL = 'http://localhost:3001/api';

  const cargarTareaDelDia = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/tarea-del-dia/actual`);

      if (response.data.tieneSesiones && response.data.tarea) {
        setTarea(response.data.tarea);
        setSesion(response.data.sesion);
        setModo('tarea-del-dia');
      } else {
        setTarea(null);
        setSesion(null);
        setModo('sin-sesiones');
      }
      
    } catch (err) {
      setError('Error al cargar tarea del día: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const cargarDatos = async () => {
      if (tareaId) {
        setLoading(true);
        try {
          const response = await axios.get(`${API_BASE_URL}/tareas/${tareaId}`);
          setTarea(response.data);
          setSesion(response.data.sesion);
          setModo('tarea-especifica');
          
        } catch (err) {
          setError('Error al cargar tarea específica: ' + (err.response?.data?.message || err.message));
        } finally {
          setLoading(false);
        }
      } else {
        cargarTareaDelDia();
      }
    };

    cargarDatos();
  }, [tareaId, state]);

  // ⛔ FIX: Inicializar el tiempo **solo** cuando llega la tarea
  React.useEffect(() => {
    if (tarea && tarea.tiempo_real_ejecucion !== undefined) {
      setTiempoTranscurrido(tarea.tiempo_real_ejecucion || 0);
    }
  }, [tarea]);

  // ⛔ FIX PRINCIPAL: El temporizador YA NO toca tarea.tiempo_real_ejecucion
  React.useEffect(() => {
    if (estaActiva && !intervalId) {
      const id = setInterval(() => {
        setTiempoTranscurrido(prev => prev + 1);
      }, 1000);
      setIntervalId(id);
    } else if (!estaActiva && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [estaActiva, intervalId]);

  const formatTiempo = (segundos) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  const manejarAccion = async (accion) => {
    if (!tarea) return;

    try {
      const tiempoEjecutado = 
        (accion === 'stop' || accion === 'pause') 
          ? tiempoTranscurrido 
          : 0;
      
      const response = await axios.post(`${API_BASE_URL}/tareas/${tarea.id}/gestionar`, {
        action: accion,
        tiempo_ejecutado: tiempoEjecutado
      });

      if (accion === 'start') {
        setEstaActiva(true);
      } else if (accion === 'pause') {
        setEstaActiva(false);
        setTarea(response.data.tarea);
      } else if (accion === 'stop') {
        setEstaActiva(false);
        setTarea(response.data.tarea);
        setTiempoTranscurrido(0);
      }

      //alert(`Tarea ${accion} exitosamente`);

    } catch (err) {
      alert('Error al gestionar tarea: ' + (err.response?.data?.message || err.message));
    }
  };

  const eliminarTarea = async () => {
    if (!tarea) return;

    if (!window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/tareas/${tarea.id}`);
      alert('Tarea eliminada exitosamente');
      
      if (modo === 'tarea-del-dia') {
        cargarTareaDelDia();
      } else {
        navigate('/gestor-estudio');
      }
    } catch (err) {
      alert('Error al eliminar tarea: ' + (err.response?.data?.message || err.message));
    }
  };

  const crearNuevaSesion = () => {
    navigate('/');
  };

  const irAGestorEstudio = () => {
    navigate('/gestor-estudio');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => navigate('/gestor-estudio')}>
          Volver al gestor de estudio
        </button>
      </div>
    );
  }

  if (modo === 'sin-sesiones') {
    return (
      <div style={{ maxWidth: '600px', margin: '50px auto', textAlign: 'center', padding: '40px' }}>
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <h1>📚 No hay sesiones activas</h1>
          <p>No tienes sesiones de estudio planificadas.</p>
          
          <button onClick={crearNuevaSesion}>Crear Nueva Sesión</button>
          <button onClick={irAGestorEstudio}>Ver Gestor de Estudio</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>

        <button onClick={() => navigate('/gestor-estudio')}>
          ↩️ Volver
        </button>

        <h1>🎯 Gestor de Tarea</h1>
        
        {tarea && (
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h2>{tarea.nombre}</h2>

            
            
          </div>
        )}

        {/* ⏰ TEMPORIZADOR FIX: ahora muestra tiempoTranscurrido */}
        {tarea && !tarea.es_completada && (
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3>⏰ Temporizador</h3>

            <div style={{ fontSize: '2em', fontWeight: 'bold' }}>
              {formatTiempo(tiempoTranscurrido)}
            </div>

            <button onClick={() => manejarAccion('start')} disabled={estaActiva}>
              ▶️ Iniciar
            </button>

            <button onClick={() => manejarAccion('pause')} disabled={!estaActiva}>
              ⏸️ Pausar
            </button>

            <button onClick={() => manejarAccion('stop')}>
              ⏹️ Completar
            </button>
          </div>
        )}

        {sesion && (
          <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px' }}>
            <h4>📚 Sesión Padre</h4>
            <p>{sesion.nombre}</p>
          </div>
        )}

        {tarea && (
          <button onClick={eliminarTarea}>🗑️ Eliminar Tarea</button>
        )}
      </div>
    </div>
  );
};

export default TareaManager;
