const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Tarea = sequelize.define('Tarea', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre de la tarea no puede estar vacío' },
        len: { args: [2, 100], msg: 'El nombre debe tener entre 2 y 100 caracteres' }
      }
    },
    sesion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'El ID de sesión debe ser un número entero' }
      }
    },
    fecha_programada: { 
      type: DataTypes.DATEONLY, 
      allowNull: false,
      validate: {
        isDate: { msg: 'La fecha debe ser válida' }
      }
    },
    duracion_estimada: { 
      type: DataTypes.INTEGER, 
      defaultValue: 60,
      validate: {
        min: { args: [1], msg: 'La duración estimada debe ser al menos 1 minuto' },
        max: { args: [480], msg: 'La duración estimada no puede exceder 8 horas' }
      }
    },
    dificultad_nivel: { 
      type: DataTypes.INTEGER, 
      defaultValue: 3,
      validate: {
        min: { args: [1], msg: 'El nivel de dificultad debe ser al menos 1' },
        max: { args: [5], msg: 'El nivel de dificultad no puede exceder 5' }
      }
    },
    tiempo_total_requerido: { 
      type: DataTypes.INTEGER, 
      defaultValue: 0 
    },
    tiempo_real_ejecucion: { 
      type: DataTypes.INTEGER, 
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: 'El tiempo real no puede ser negativo' }
      }
    },
    es_completada: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: false 
    },
    feedback_dominio: { 
      type: DataTypes.ENUM('Nada', 'Poco', 'Regular', 'Bien', 'Todo'),
      defaultValue: 'Regular'
    },
    creado_en: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    actualizado_en: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'tareas',
    timestamps: false,
    hooks: {
      beforeUpdate: (tarea) => {
        tarea.actualizado_en = new Date();
      },
      beforeValidate: (tarea) => {
        // Calcular tiempo total requerido basado en dificultad
        if (tarea.duracion_estimada && tarea.dificultad_nivel) {
          const factoresDificultad = [0.6, 0.8, 1.0, 1.4, 1.7];
          const factor = factoresDificultad[tarea.dificultad_nivel - 1] || 1.0;
          tarea.tiempo_total_requerido = Math.round(tarea.duracion_estimada * factor);
        }
      }
    }
  });

  // ASOCIACIÓN SIMPLIFICADA
  Tarea.associate = function(models) {
    Tarea.belongsTo(models.Sesion, {
      foreignKey: 'sesion_id',
      as: 'sesion'
    });
  };

  // Métodos de instancia útiles
  Tarea.prototype.marcarComoCompletada = function(tiempoReal = null) {
    this.es_completada = true;
    if (tiempoReal !== null) {
      this.tiempo_real_ejecucion = tiempoReal;
    }
    this.feedback_dominio = 'Todo';
  };

  Tarea.prototype.obtenerProgreso = function() {
    if (this.tiempo_total_requerido === 0) return 0;
    return Math.min(100, Math.round((this.tiempo_real_ejecucion / this.tiempo_total_requerido) * 100));
  };

  Tarea.prototype.esHoy = function() {
    const hoy = new Date().toISOString().split('T')[0];
    return this.fecha_programada === hoy;
  };

  return Tarea;
};
