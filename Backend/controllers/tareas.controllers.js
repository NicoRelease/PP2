// models/tarea.js
module.exports = (sequelize, DataTypes) => {
  const Tarea = sequelize.define('Tarea', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sesion_id: { // ← CAMBIO IMPORTANTE: ahora pertenece a una sesión
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Sesiones',
        key: 'id'
      }
    },
    duracion_estimada: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tiempo_real_ejecucion: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    es_completada: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    feedback_dominio: {
      type: DataTypes.INTEGER,
      defaultValue: 3
    }
  }, {
    tableName: 'tareas'
  });

  Tarea.associate = function(models) {
    Tarea.belongsTo(models.Sesion, {
      foreignKey: 'sesion_id',
      as: 'Sesion'
    });
  };

  return Tarea;
};
