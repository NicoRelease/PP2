import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

const TareaManager = () => {
  const { tareaId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const [tarea, setTarea] = React.useState(null);
  const [sesion, setSesion] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [tiempoTranscurrido, setTiempoTranscurrido] = React.useState(0);
  const [estaActiva, setEstaActiva] = React.useState(false);
  const [intervalId, setIntervalId] = React.useState(null);
  const [modo, setModo] = React.useState('tarea-especifica'); // 'tarea-especifica' o 'tarea-del-dia'

  const API_BASE_URL = 'http://localhost:3001/api';

  // ✅ NUEVA FUNCIÓN: Cargar tarea del día automáticamente
  const cargarTareaDelDia = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Cargando tarea del día...');
      const response = await axios.get(`${API_BASE_URL}/tarea-del-dia/actual`);
      console.log('📦 Respuesta tarea del día:', response.data);

      if (response.data.tieneSesiones && response.data.tarea) {
        setTarea(response.data.tarea);
        setSesion(response.data.sesion);
        setModo('tarea-del-dia');
      } else {
        // No hay sesiones activas
        setTarea(null);
        setSesion(null);
        setModo('sin-sesiones');
      }
      
    } catch (err) {
      const errorMsg = 'Error al cargar tarea del día: ' + (err.response?.data?.message || err.message);
      console.error('❌ Error:', errorMsg, err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const cargarDatos = async () => {
      // Si viene con ID específico, cargar esa tarea
      if (tareaId) {
        setLoading(true);
        try {
          console.log('🔍 Cargando tarea específica:', tareaId);
          
          // PRIMERO: Intentar usar los datos del estado
          if (state && state.tarea) {
            console.log('📦 Usando tarea del estado:', state.tarea);
            setTarea(state.tarea);
            setSesion(state.sesion);
            setModo('tarea-especifica');
            setLoading(false);
            return;
          }
          
          // SEGUNDO: Si no hay estado, hacer petición al backend
          const response = await axios.get(`${API_BASE_URL}/tareas/${tareaId}`);
          console.log('📦 Tarea cargada del backend:', response.data);
          setTarea(response.data);
          setSesion(response.data.sesion);
          setModo('tarea-especifica');
          
        } catch (err) {
          const errorMsg = 'Error al cargar tarea específica: ' + (err.response?.data?.message || err.message);
          console.error('❌ Error:', errorMsg, err);
          setError(errorMsg);
        } finally {
          setLoading(false);
        }
      } else {
        // Si no viene con ID, cargar tarea del día automáticamente
        cargarTareaDelDia();
      }
    };

    cargarDatos();
  }, [tareaId, state]);

  // Temporizador para contar el tiempo
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
      console.log(`🎯 Ejecutando acción: ${accion} en tarea ${tarea.id}`);
      
      const tiempoEjecutado = accion === 'stop' ? tiempoTranscurrido : 0;
      
      const response = await axios.post(`${API_BASE_URL}/tareas/${tarea.id}/gestionar`, {
        action: accion,
        tiempo_ejecutado: tiempoEjecutado
      });

      // Actualizar estado local
      if (accion === 'start') {
        setEstaActiva(true);
        setTiempoTranscurrido(0);
      } else if (accion === 'pause') {
        setEstaActiva(false);
      } else if (accion === 'stop') {
        setEstaActiva(false);
        setTarea(response.data.tarea);
        setTiempoTranscurrido(0);
      }

      console.log('✅ Acción ejecutada:', response.data);
      alert(`Tarea ${accion} exitosamente`);

    } catch (err) {
      const errorMsg = 'Error al gestionar tarea: ' + (err.response?.data?.message || err.message);
      console.error('❌ Error:', errorMsg, err);
      alert(errorMsg);
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
      
      // Si estamos en modo tarea-del-dia, recargar la tarea del día
      if (modo === 'tarea-del-dia') {
        cargarTareaDelDia();
      } else {
        navigate('/gestor-estudio');
      }
    } catch (err) {
      const errorMsg = 'Error al eliminar tarea: ' + (err.response?.data?.message || err.message);
      alert(errorMsg);
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

  // ✅ VISTA CUANDO NO HAY SESIONES
  if (modo === 'sin-sesiones') {
    return (
      <div style={{ maxWidth: '600px', margin: '50px auto', textAlign: 'center', padding: '40px' }}>
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ color: '#6c757d', marginBottom: '20px' }}>📚 No hay sesiones activas</h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
            No tienes sesiones de estudio planificadas. Crea una nueva sesión para comenzar a organizar tu tiempo de estudio.
          </p>
          
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={crearNuevaSesion}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                minWidth: '200px'
              }}
            >
              ✍️ Crear Nueva Sesión
            </button>
            
            <button 
              onClick={irAGestorEstudio}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                minWidth: '200px'
              }}
            >
              📊 Ver Gestor de Estudio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ VISTA NORMAL CON TAREA
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button 
            onClick={() => navigate('/gestor-estudio')}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            ↩️ Volver al Gestor de Estudio
          </button>
          
          <div style={{
            backgroundColor: modo === 'tarea-del-dia' ? '#28a745' : '#007bff',
            color: 'white',
            padding: '5px 15px',
            borderRadius: '15px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {modo === 'tarea-del-dia' ? '🔄 Tarea del Día Automática' : '🎯 Tarea Específica'}
          </div>
        </div>

        <h1>🎯 Gestor de Tarea</h1>
        
        {tarea && (
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h2 style={{ color: '#333', marginBottom: '15px' }}>{tarea.nombre}</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div>
                <strong>📅 Fecha programada:</strong><br />
                {new Date(tarea.fecha_programada).toLocaleDateString()}
              </div>
              <div>
                <strong>⏱️ Duración estimada:</strong><br />
                {tarea.duracion_estimada} minutos
              </div>
              <div>
                <strong>📊 Estado:</strong><br />
                {tarea.es_completada ? '✅ Completada' : '⏳ Pendiente'}
              </div>
              <div>
                <strong>⚡ Dificultad:</strong><br />
                Nivel {tarea.dificultad_nivel || 3}
              </div>
            </div>

            {tarea.tiempo_real_ejecucion && (
              <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e7f3ff', borderRadius: '5px' }}>
                <strong>⏰ Tiempo real ejecutado:</strong> {tarea.tiempo_real_ejecucion} minutos
              </div>
            )}
          </div>
        )}

        {/* Controles de tiempo */}
        {tarea && !tarea.es_completada && (
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '15px' }}>⏰ Temporizador</h3>
            <div style={{ fontSize: '2em', fontWeight: 'bold', marginBottom: '20px' }}>
              {formatTiempo(tiempoTranscurrido)}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => manejarAccion('start')}
                disabled={estaActiva}
                style={{
                  backgroundColor: estaActiva ? '#ccc' : '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '5px',
                  cursor: estaActiva ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                ▶️ Iniciar
              </button>
              
              <button
                onClick={() => manejarAccion('pause')}
                disabled={!estaActiva}
                style={{
                  backgroundColor: !estaActiva ? '#ccc' : '#ffc107',
                  color: 'black',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '5px',
                  cursor: !estaActiva ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                ⏸️ Pausar
              </button>
              
              <button
                onClick={() => manejarAccion('stop')}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                ⏹️ Completar
              </button>
            </div>
          </div>
        )}

        {/* Información de la sesión padre */}
        {sesion && (
          <div style={{
            backgroundColor: '#fff3cd',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h4>📚 Sesión Padre</h4>
            <p><strong>Nombre:</strong> {sesion.nombre}</p>
            <p><strong>Fecha de examen:</strong> {new Date(sesion.fecha_programada).toLocaleDateString()}</p>
          </div>
        )}

        {/* Botón de eliminar */}
        {tarea && (
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={eliminarTarea}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🗑️ Eliminar esta Tarea
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TareaManager;
