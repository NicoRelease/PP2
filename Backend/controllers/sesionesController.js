const db = require('../models');
const { Sesion, Tarea, sequelize } = db;
const { Op } = require('sequelize');

// Factores de dificultad para cálculos
const DIFICULTAD_FACTORES = [0.6, 0.8, 1.0, 1.4, 1.7];

// Función auxiliar para calcular días entre fechas
const diasEntre = (start, end) => {
    const oneDay = 1000 * 60 * 60 * 24;
    const diffTime = new Date(end) - new Date(start);
    return Math.round(diffTime / oneDay);
};

// =======================================================
// CONTROLADOR PRINCIPAL - VERSIÓN CORREGIDA
// =======================================================

exports.crearSesion = async (req, res) => {
  const { nombre, fecha_examen, duracion_diaria_estimada } = req.body;

  if (!nombre || !fecha_examen || !duracion_diaria_estimada) {
    return res.status(400).json({
      message: "Faltan campos obligatorios: nombre, fecha_examen, duracion_diaria_estimada"
    });
  }

  try {
    // 1. Convertir la fecha_examen a Date object
    const fechaExamenDate = new Date(fecha_examen);
    
    // 2. Obtener la fecha actual (sin horas/minutos/segundos)
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    // 3. Comparación simple - asegurarse de que la fecha de examen es futura
    //if (fechaExamenDate < hoy) {
    //  return res.status(400).json({
     //   message: `La fecha de examen debe ser futura. Fecha examen: ${fechaExamenDate.toISOString().split('T')[0]}, Hoy: ${hoy.toISOString().split('T')[0]}`
    //  });
    //}

    // 4. Si pasa la validación, continuar con el resto del código...
    console.log("✅ Fecha válida - continuando con la creación de la sesión");
    
    // ... aquí va el resto de tu lógica para crear la sesión y tareas

    res.status(201).json({
      message: "Sesión creada exitosamente",
      // ... otros datos de respuesta
    });

  } catch (error) {
    console.error("Error al crear sesión:", error);
    res.status(500).json({ 
      message: "Error interno al crear sesión", 
      error: error.message 
    });
  }
};




// =======================================================
// FUNCIÓN DE VALIDACIÓN (OPCIONAL)
// =======================================================

exports.validarFechaExamen = async (req, res) => {
    const { fecha_examen } = req.body;

    if (!fecha_examen) {
        return res.status(400).json({ 
            valida: false,
            message: "La fecha es requerida" 
        });
    }

    try {
        const hoy = new Date();
        const fechaExamen = new Date(fecha_examen);
        
        // Normalizar a medianoche
        hoy.setHours(0, 0, 0, 0);
        fechaExamen.setHours(0, 0, 0, 0);
        
        // Permitir hoy y futuras
        if (fechaExamen < hoy) {
            return res.status(200).json({
                valida: false,
                message: "La fecha de examen no puede ser pasada. Debe ser hoy o una fecha futura."
            });
        }

        return res.status(200).json({
            valida: true,
            message: "Fecha válida"
        });

    } catch (error) {
        console.error("Error al validar fecha:", error);
        res.status(500).json({ 
            valida: false,
            message: "Error al validar la fecha",
            error: error.message 
        });
    }
};

// =======================================================
// RESTO DE FUNCIONES (MANTENER)
// =======================================================

exports.obtenerTodasLasSesiones = async (req, res) => {
    try {
        const sesiones = await Sesion.findAll({
            include: [{ model: Tarea, as: 'tareas' }],
            order: [
                ['fecha_programada', 'ASC'],
                [{ model: Tarea, as: 'tareas' }, 'fecha_programada', 'ASC']
            ]
        });

        res.status(200).json(sesiones);
    } catch (error) {
        console.error("Error al obtener sesiones:", error);
        res.status(500).json({ message: "Error interno al obtener sesiones", error: error.message });
    }
};

exports.obtenerSesionPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const sesion = await Sesion.findByPk(id, {
            include: [{ model: Tarea, as: 'tareas' }]
        });

        if (!sesion) {
            return res.status(404).json({ message: "Sesión no encontrada" });
        }

        res.status(200).json(sesion);
    } catch (error) {
        console.error("Error al obtener sesión:", error);
        res.status(500).json({ message: "Error interno al obtener sesión", error: error.message });
    }
};

exports.eliminarSesionCompleta = async (req, res) => {
    const { id } = req.params;
    const t = await sequelize.transaction();

    try {
        await Tarea.destroy({
            where: { sesion_id: id },
            transaction: t
        });

        const eliminadas = await Sesion.destroy({
            where: { id: id },
            transaction: t
        });

        if (eliminadas === 0) {
            await t.rollback();
            return res.status(404).json({ message: "Sesión no encontrada" });
        }

        await t.commit();
        res.status(204).send();

    } catch (error) {
        await t.rollback();
        console.error("Error al eliminar sesión:", error);
        res.status(500).json({ message: "Error interno al eliminar sesión", error: error.message });
    }
};

exports.obtenerSesionActiva = async (req, res) => {
    try {
        const hoy = new Date().toISOString().split('T')[0];

        const sesionActual = await Sesion.findOne({
            where: {
                es_completada: false,
                fecha_programada: { [Op.gte]: hoy }
            },
            include: [{ model: Tarea, as: 'tareas' }],
            order: [['fecha_programada', 'ASC']]
        });

        const historial = await Sesion.findAll({
            where: {
                es_completada: true
            },
            include: [{ model: Tarea, as: 'tareas' }],
            order: [['fecha_programada', 'DESC']],
            limit: 10
        });

        res.status(200).json({
            sesionActual,
            historial
        });

    } catch (error) {
        console.error("Error al obtener sesión activa:", error);
        res.status(500).json({ message: "Error interno al obtener sesión activa", error: error.message });
    }
};

exports.gestionarTarea = async (req, res) => {
    const { id } = req.params;
    const { action, tiempo_ejecutado } = req.body;

    if (!['start', 'pause', 'stop'].includes(action)) {
        return res.status(400).json({ message: "Acción no válida. Use: start, pause, o stop" });
    }

    const t = (action === 'stop') ? await sequelize.transaction() : null;

    try {
        const tarea = await Tarea.findByPk(id, { 
            include: [{ model: Sesion, as: 'sesion' }],
            transaction: t 
        });

        if (!tarea) {
            if (t) await t.rollback();
            return res.status(404).json({ message: "Tarea no encontrada" });
        }

        const updates = {};

        if (action === 'start') {
            updates.tiempo_real_ejecucion = tiempo_ejecutado;
        } else if (action === 'pause') {
            updates.tiempo_real_ejecucion = tiempo_ejecutado;
        } else if (action === 'stop') {
            updates.tiempo_real_ejecucion = tiempo_ejecutado;
            updates.es_completada = true;
            updates.feedback_dominio = 'Todo';
        }

        await tarea.update(updates, { transaction: t });

        if (t) await t.commit();

        const tareaActualizada = await Tarea.findByPk(id, {
            include: [{ model: Sesion, as: 'sesion' }]
        });

        res.status(200).json({ 
            message: `Tarea ${action} exitosamente`,
            tarea: tareaActualizada 
        });

    } catch (error) {
        if (t) await t.rollback();
        console.error("Error al gestionar tarea:", error);
        res.status(500).json({ message: "Error interno al gestionar tarea", error: error.message });
    }
};

exports.eliminarTarea = async (req, res) => {
    const { id } = req.params;
    const t = await sequelize.transaction();

    try {
        const tarea = await Tarea.findByPk(id, { transaction: t });

        if (!tarea) {
            await t.rollback();
            return res.status(404).json({ message: "Tarea no encontrada" });
        }

        await Tarea.destroy({
            where: { id: id },
            transaction: t
        });

        await t.commit();
        res.status(204).send();

    } catch (error) {
        await t.rollback();
        console.error("Error al eliminar tarea:", error);
        res.status(500).json({ message: "Error interno al eliminar tarea", error: error.message });
    }
};

exports.obtenerTareaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const tarea = await Tarea.findByPk(id, {
            include: [{ model: Sesion, as: 'sesion' }]
        });

        if (!tarea) {
            return res.status(404).json({ message: "Tarea no encontrada" });
        }

        res.status(200).json(tarea);
    } catch (error) {
        console.error("Error al obtener tarea:", error);
        res.status(500).json({ message: "Error interno al obtener tarea", error: error.message });
    }
};

exports.obtenerTareaDelDia = async (req, res) => {
    try {
        const hoy = new Date().toISOString().split('T')[0];
        
        const sesionActiva = await Sesion.findOne({
            where: {
                es_completada: false,
                fecha_programada: { [Op.gte]: hoy }
            },
            include: [{ model: Tarea, as: 'tareas' }],
            order: [['fecha_programada', 'ASC']]
        });

        if (!sesionActiva) {
            return res.status(200).json({ 
                tieneSesiones: false,
                message: "No hay sesiones activas.",
                tarea: null,
                sesion: null
            });
        }

        const tareaHoy = await Tarea.findOne({
            where: {
                sesion_id: sesionActiva.id,
                fecha_programada: hoy,
                es_completada: false
            },
            include: [{ model: Sesion, as: 'sesion' }],
            order: [['id', 'ASC']]
        });

        if (!tareaHoy) {
            const proximaTarea = await Tarea.findOne({
                where: {
                    sesion_id: sesionActiva.id,
                    fecha_programada: { [Op.gte]: hoy },
                    es_completada: false
                },
                include: [{ model: Sesion, as: 'sesion' }],
                order: [
                    ['fecha_programada', 'ASC'],
                    ['id', 'ASC']
                ]
            });

            return res.status(200).json({
                tieneSesiones: true,
                message: "No hay tareas para hoy. Próxima tarea disponible.",
                tarea: proximaTarea,
                sesion: sesionActiva
            });
        }

        res.status(200).json({
            tieneSesiones: true,
            message: "Tarea del día encontrada",
            tarea: tareaHoy,
            sesion: sesionActiva
        });

    } catch (error) {
        console.error("Error al obtener tarea del día:", error);
        res.status(500).json({ 
            message: "Error interno al obtener tarea del día", 
            error: error.message 
        });
    }
};
0