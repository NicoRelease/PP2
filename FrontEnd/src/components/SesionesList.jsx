// components/TareasPorFecha.jsx
import React from 'react';
import Conversion from './Conversion';

// Añado onDeleteSesion a las props del componente
const TareasPorSesion = ({ sesiones, onTareaClick, onDeleteTarea, onGestionarTarea, onDeleteSession }) => {

  // ============================================================
  // 📌 AGRUPAR TAREAS POR SESIÓN (nuevo comportamiento solicitado)
  // ============================================================
  const agruparTareasPorSesion = () => {
    if (!sesiones || sesiones.length === 0) return {};

    const agrupado = {};

    sesiones.forEach(sesion => {
      const tareas = sesion.tareas || [];

      agrupado[sesion.id] = {
        sesionInfo: {
          id: sesion.id,
          nombre: sesion.nombre,
          fecha_examen: sesion.fecha_examen,
        },
        tareas: tareas.map(t => ({
          ...t,
          sesionPadre: {
            id: sesion.id,
            nombre: sesion.nombre,
            fecha_examen: sesion.fecha_examen
          }
        })),
        totalDuracionEstimada: tareas.reduce((acc, t) => acc + (t.duracion_estimada || 0), 0)
      };
    });

    return agrupado;
  };

  // ============================================================
  // 📌 Resumen General (ahora basado en sesiones)
  // ============================================================
  const calcularResumenGeneral = () => {
    const grupos = agruparTareasPorSesion();
    let totalTareas = 0;
    let totalDuracion = 0;
    let tareasCompletadas = 0;

    Object.values(grupos).forEach(grupo => {
      totalTareas += grupo.tareas.length;
      totalDuracion += grupo.totalDuracionEstimada;
      tareasCompletadas += grupo.tareas.filter(t => t.es_completada).length;
    });

    return {
      totalTareas,
      totalDuracion,
      tareasCompletadas,
      tareasPendientes: totalTareas - tareasCompletadas,
      totalSesiones: Object.keys(grupos).length
    };
  };

  const tareasPorSesion = agruparTareasPorSesion();
  const resumenGeneral = calcularResumenGeneral();

  if (Object.keys(tareasPorSesion).length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>No hay tareas planificadas.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '20px', minHeight: '600px' }}>

      {/* =======================================================
          PANEL PRINCIPAL: TAREAS AGRUPADAS POR SESIÓN
      ======================================================== */}
      <div style={{ flex: 3 }}>
        <h3 style={{ color: '#333', marginBottom: '25px' }}>
          📚 Tareas agrupadas por Sesión
        </h3>

        {Object.entries(tareasPorSesion).map(([sesionId, grupo]) => {
          const sesion = grupo.sesionInfo;

          return (
            <div
              key={sesionId}
              style={{
                border: '2px solid #e0e0e0',
                padding: '20px',
                margin: '20px 0',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                backgroundColor: 'white'
              }}
            >
              {/* Encabezado de la sesión */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px',
                paddingBottom: '10px',
                borderBottom: '2px solid #007bff'
              }}>
                <h4 style={{ margin: 0, color: '#007bff' }}>
                  📘 {sesion.nombre}
                </h4>
                
                {/* Contenedor del tiempo total y el botón de eliminar */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {/* Botón de Eliminar Sesión AÑADIDO AQUÍ */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // Llamamos a la nueva prop con el ID de la sesión
                            onDeleteSession(sesion.id, sesion.nombre); 
                        }}
                        style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 'bold'
                        }}
                        title={`Eliminar la sesión: ${sesion.nombre}`}
                    >
                        🗑️ Borrar Sesión
                    </button>
                    
                    <div style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      padding: '5px 15px',
                      borderRadius: '15px',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      {(grupo.totalDuracionEstimada / 60)>1 ? 
                        `⏱️ Tiempo total de sesión: ${(grupo.totalDuracionEstimada / 60).toFixed(0)} horas` : `⏱️ Tiempo total de sesión: ${(grupo.totalDuracionEstimada / 60).toFixed(0)} hora`}
                    </div>
                </div>
              </div>

              {/* Tareas de la sesión */}
              <div style={{ display: 'grid', gap: '12px' }}>
                {grupo.tareas.map((tarea) => (
                  <div
                    key={tarea.id}
                    style={{
                      border: '1px solid #ddd',
                      padding: '15px',
                      borderRadius: '6px',
                      backgroundColor: tarea.es_completada ? '#f8fff8' : '#fff',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => onTareaClick(tarea, tarea.sesionPadre)}
                  >

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      
                      <div style={{ flex: 1 }}>
                        <h5 style={{
                          margin: '0 0 8px',
                          color: tarea.es_completada ? '#28a745' : '#333',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          {tarea.es_completada ? '✅' : '📝'} {tarea.nombre}
                        </h5>

                        <div style={{ fontSize: '13px', color: '#666' }}>
                          <div><strong>🎯 Examen:</strong> {new Date(sesion.fecha_examen).toLocaleDateString()}</div>
                          </div>
                      </div>

                      <div style={{ textAlign: 'right', minWidth: '120px' }}>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: tarea.es_completada ? '#28a745' : '#ffc107',
                          marginBottom: '5px'
                        }}>
                          {tarea.duracion_estimada} min
                        </div>

                        <div style={{
                          fontSize: '12px',
                          padding: '3px 8px',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '12px',
                          display: 'inline-block',
                          color: tarea.es_completada ? '#28a745' : '#999'
                        }}>
                          {tarea.es_completada ?
                            `Tiempo real: ${Conversion(tarea.tiempo_real_ejecucion)}` :
                            '⏳ Pendiente'}
                        </div>
                      </div>
                    </div>

                    {/* Botones */}
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      marginTop: '12px',
                      justifyContent: 'flex-end'
                    }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTarea(tarea.id, tarea.nombre, e);
                        }}
                        style={{
                          backgroundColor: '#6c757d',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: 'bold'
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* =======================================================
          PANEL LATERAL DE RESUMEN
      ======================================================== */}
      <div style={{ flex: 1 }}>
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: '20px',
          height: 'fit-content'
        }}>
          <h3 style={{ marginTop: 0, color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
            📊 Resumen General
          </h3>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ color: '#007bff', marginBottom: '15px', fontSize: '16px' }}>
              📈 Estadísticas Totales
            </h4>

            <div style={{ display: 'grid', gap: '12px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'white', padding: '8px', borderRadius: '5px' }}>
                <span>📚 Total sesiones:</span>
                <strong>{resumenGeneral.totalSesiones}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'white', padding: '8px', borderRadius: '5px' }}>
                <span>📝 Total tareas:</span>
                <strong>{resumenGeneral.totalTareas}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'white', padding: '8px', borderRadius: '5px' }}>
                <span style={{ color: '#28a745' }}>✅ Completadas:</span>
                <strong style={{ color: '#28a745' }}>{resumenGeneral.tareasCompletadas}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'white', padding: '8px', borderRadius: '5px' }}>
                <span style={{ color: '#ffc107' }}>⏳ Pendientes:</span>
                <strong style={{ color: '#ffc107' }}>{resumenGeneral.tareasPendientes}</strong>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                backgroundColor: '#e7f3ff',
                padding: '8px',
                borderRadius: '5px',
                borderTop: '2px solid #007bff'
              }}>
                <span>⏱️ Tiempo total:</span>
                <strong style={{ color: '#007bff' }}>
                  {(resumenGeneral.totalDuracion / 60).toFixed(1)} horas
                </strong>
              </div>

            </div>
          </div>

          <div style={{
            marginTop: '20px',
            padding: '12px',
            backgroundColor: '#e7f3ff',
            borderRadius: '6px',
            fontSize: '12px',
            borderLeft: '4px solid #007bff'
          }}>
            <strong style={{ color: '#007bff' }}>💡 Consejo:</strong>
            <p style={{ margin: '5px 0 0 0' }}>
              Ahora puedes ver todas tus tareas organizadas por sesión para controlar mejor tu rutina de estudio.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TareasPorSesion;