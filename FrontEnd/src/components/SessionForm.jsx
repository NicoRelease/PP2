import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewSessionForm = ({ onSesionCreada }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    fecha_examen: '',
    duracion_diaria_estimada: 60,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:3001/api';

  // ✅ SOLUCIÓN CORREGIDA: Manejo correcto de zona horaria
  const validarFechaLocalmente = (fecha_examen) => {
    if (!fecha_examen) {
      return { valida: false, message: "La fecha de examen es requerida." };
    }

    // ✅ CORRECCIÓN: Usar el mismo método que el input date (YYYY-MM-DD)
    const hoy = new Date();
    const hoyNormalizado = new Date(hoy.toISOString().split('T')[0]); // Solo la parte de la fecha
    
    const fechaExamen = new Date(fecha_examen);
    
    console.log('🔍 Debug fechas:', {
      fechaIngresada: fecha_examen,
      fechaExamenObj: fechaExamen,
      hoyNormalizado: hoyNormalizado,
      hoyISO: hoy.toISOString().split('T')[0]
    });

    // ✅ CORRECCIÓN: Comparar solo las partes de fecha (ignorar tiempo)
    const fechaExamenSola = new Date(fechaExamen.toISOString().split('T')[0]);
    const hoySolo = new Date(hoy.toISOString().split('T')[0]);
    
    // Permitir hoy y futuras
    if (fechaExamenSola < hoySolo) {
      return {
        valida: false,
        message: `La fecha de examen no puede ser pasada. Fecha ingresada: ${fecha_examen}, Hoy: ${hoySolo.toISOString().split('T')[0]}`
      };
    }
    
    return { valida: true, message: "Fecha válida" };
  };

  const handleChange = (e) => {
    const value = e.target.name === 'duracion_diaria_estimada' 
      ? parseInt(e.target.value) || 0 
      : e.target.value;
      
    setFormData({ ...formData, [e.target.name]: value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validación básica
    if (formData.duracion_diaria_estimada < 10) {
      setError("La duración diaria debe ser de al menos 10 minutos.");
      setLoading(false);
      return;
    }

    // ✅ ELIMINAR VALIDACIÓN DE FECHA EN FRONTEND - Dejar que el backend maneje
    // const validacion = validarFechaLocalmente(formData.fecha_examen);
    // if (!validacion.valida) {
    //   setError(validacion.message);
    //   setLoading(false);
    //   return;
    // }

    try {
      console.log('📤 Enviando datos:', formData);
      
      // Enviar al backend - que él maneje la validación
      const response = await axios.post(`${API_BASE_URL}/`, formData);

      console.log('✅ Sesión creada:', response.data);
      
      let mensajeExito = 'Sesión creada exitosamente!';
      
      // Manejar diferentes formatos de respuesta del backend
      if (response.data.sesion) {
        const nombreSesion = response.data.sesion.nombre;
        const tareasCreadas = response.data.tareasCreadas || response.data.sesion.tareas?.length || 0;
        mensajeExito = `✅ Sesión '${nombreSesion}' planificada con éxito! Se crearon ${tareasCreadas} tareas.`;
      } else if (response.data.nombre) {
        mensajeExito = `✅ Sesión '${response.data.nombre}' creada exitosamente!`;
      }
      
      alert(mensajeExito);
      
      if (onSesionCreada) {
        onSesionCreada(response.data);
      }

      // Limpiar formulario y navegar
      setFormData({ nombre: '', fecha_examen: '', duracion_diaria_estimada: 60 });
      navigate('/gestor-estudio');

    } catch (error) {
      console.error("❌ Error al planificar:", error);
      
      // Manejo de errores
      let errorMsg = 'Error al planificar la sesión';
      
      if (error.response) {
        errorMsg = error.response.data.message || errorMsg;
      } else if (error.request) {
        errorMsg = 'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.';
      } else {
        errorMsg = error.message;
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SOLUCIÓN SIMPLE: Usar el método nativo del input date
  const obtenerFechaMinima = () => {
    return new Date().toISOString().split('T')[0];
  };

  const fechaMinima = obtenerFechaMinima();

  return (
    <div style={{ 
      padding: '30px', 
      border: '2px solid #007bff', 
      margin: '20px auto', 
      borderRadius: '10px', 
      maxWidth: '450px',
      backgroundColor: '#f8f9fa',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ textAlign: 'center', color: '#007bff', marginBottom: '25px' }}>
        📝 Crear Nueva Sesión de Estudio
      </h3>
      
      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="nombre" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            📚 Nombre de la Sesión:
          </label>
          <input 
            type="text" 
            id="nombre" 
            name="nombre" 
            value={formData.nombre} 
            onChange={handleChange} 
            required 
            placeholder="Ej: Examen Final de Matemáticas"
            style={{ 
              width: '100%', 
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }} 
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="fecha_examen" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            🗓️ Fecha de Examen:
          </label>
          <input 
            type="date" 
            id="fecha_examen" 
            name="fecha_examen" 
            value={formData.fecha_examen} 
            onChange={handleChange} 
            min={fechaMinima}
            required 
            style={{ 
              width: '100%', 
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }} 
          />
          <small style={{ color: '#666', fontStyle: 'italic', marginTop: '5px', display: 'block' }}>
            ⚠️ La fecha mínima permitida es: {fechaMinima}
          </small>
        </div>
        
        <div style={{ marginBottom: '25px' }}>
          <label htmlFor="duracion_diaria_estimada" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            ⏱️ Minutos a Estudiar por Día:
          </label>
          <input 
            type="number" 
            id="duracion_diaria_estimada" 
            name="duracion_diaria_estimada" 
            value={formData.duracion_diaria_estimada} 
            onChange={handleChange} 
            min="10" 
            max="300" 
            required 
            style={{ 
              width: '100%', 
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }} 
          />
          <small style={{ color: '#666', fontStyle: 'italic', marginTop: '5px', display: 'block' }}>
            💡 Recomendado: 60-120 minutos por día
          </small>
        </div>
        
        <button 
          type="submit" 
          disabled={loading} 
          style={{ 
            width: '100%',
            padding: '15px',
            backgroundColor: loading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {loading ? '⏳ Planificando...' : '🚀 Crear Sesión'}
        </button>

        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#e7f3ff', 
          borderRadius: '5px',
          fontSize: '14px',
          color: '#0066cc'
        }}>
          <strong>💡 Información:</strong>
          <p style={{ margin: '5px 0' }}>
            El sistema creará automáticamente tareas diarias desde hoy hasta la fecha del examen.
          </p>
        </div>
      </form>
    </div>
  );
};

export default NewSessionForm;
