// components/SesionesList.jsx
import React from 'react';

const SesionesList = ({ 
  sesiones, 
  onSessionClick, 
  onTareaClick, 
  onDeleteSession, 
  onDeleteTarea, 
  onGestionarTarea 
}) => {
  return (
    <div>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        📚 Listado de Sesiones de Estudio
      </h2>
      
      {sesiones.map((sesion) => (
        <div
          key={sesion.id}
          style={{
            border: '2px solid #ccc',
            padding: '20px',
            margin: '30px 0',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            backgroundColor: 'white'
          }}
        >
          {/* Encabezado de la sesión */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f0f0f0',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '15px',
            }}
          >
            <h4 style={{ margin: 0, cursor: 'pointer' }} onClick={() => onSessionClick(sesion)}>
              {sesion.nombre} - {new Date(sesion.fecha_programada).toLocaleDateString()}
            </h4>
            <button
              onClick={() => onDeleteSession(sesion.id)}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '8px 15px',
                cursor: 'pointer',
                borderRadius: '4px',
                fontWeight: 'bold',
              }}
            >
              🗑️ Eliminar Sesión Completa
            </button>
          </div>

          <h5 style={{ marginTop: '15px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
            Tareas de esta sesión ({sesion.tareas ? sesion.tareas.length : 0} planificadas):
          </h5>
          
          {sesion.tareas && sesion.tareas.length > 0 ? (
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {sesion.tareas.map((tarea) => (
                <li
                  key={tarea.id}
                  style={{
                    borderBottom: '1px dotted #ccc',
                    padding: '15px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => onTareaClick(tarea, sesion)}>
                    <strong>{tarea.nombre}</strong>
                    <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                      ⏱️ {tarea.duracion_estimada} min | 
                      {tarea.es_completada ? 
                        `✅ Completada (${tarea.tiempo_real_ejecucion || 0} min)` : 
                        '⏳ Pendiente'}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onGestionarTarea(tarea.id, 'start');
                      }}
                      style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        fontSize: '12px',
                      }}
                    >
                      Iniciar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onGestionarTarea(tarea.id, 'stop');
                      }}
                      style={{
                        backgroundColor: '#ffc107',
                        color: 'black',
                        border: 'none',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        fontSize: '12px',
                      }}
                    >
                      Completar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTarea(tarea.id, tarea.nombre);
                      }}
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        fontSize: '12px',
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontStyle: 'italic', color: '#666' }}>
              No hay tareas planificadas para esta sesión.
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default SesionesList;
