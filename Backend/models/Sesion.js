const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Sesion = sequelize.define('Sesion', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: { 
      type: DataTypes.STRING, 
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre de la sesión no puede estar vacío' },
        len: { args: [3, 100], msg: 'El nombre debe tener entre 3 y 100 caracteres' }
      }
    },
    fecha_examen: { 
      type: DataTypes.DATEONLY, 
      allowNull: true,
      validate: {
        isDate: { msg: 'La fecha debe ser válida' },
        //isAfter: { args: new Date().toISOString().split('T')[0], msg: 'Controller: La fecha debe ser futura' }
      }
    },
    es_completada: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: false 
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
    tableName: 'sesiones',
    timestamps: false,
    hooks: {
      beforeUpdate: (sesion) => {
        sesion.actualizado_en = new Date();
      }
    }
  });

  // ASOCIACIÓN SIMPLIFICADA - Solo definir, no configurar opciones aquí
  Sesion.associate = function(models) {
    Sesion.hasMany(models.Tarea, {
      foreignKey: 'sesion_id',
      as: 'tareas'
    });
  };

  // Métodos de instancia útiles
  Sesion.prototype.calcularTiempoTotal = function() {
    if (!this.tareas) return 0;
    return this.tareas.reduce((total, tarea) => total + tarea.duracion_estimada, 0);
  };

  Sesion.prototype.calcularTiempoConsumido = function() {
    if (!this.tareas) return 0;
    return this.tareas.reduce((total, tarea) => total + tarea.tiempo_real_ejecucion, 0);
  };

  Sesion.prototype.obtenerTareasPendientes = function() {
    if (!this.tareas) return [];
    return this.tareas.filter(tarea => !tarea.es_completada);
  };

  return Sesion;
};
