const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/db.config');

// 1. Inicializar la conexión a la Base de Datos
const sequelize = new Sequelize(dbConfig);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 2. Cargar los Modelos (Tablas)
db.Sesion = require('./Sesion')(sequelize, DataTypes);
db.Tarea = require('./Tarea')(sequelize, DataTypes);

// 3. SOLO llamar a los métodos associate de los modelos (NO definir asociaciones aquí)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// 4. Función de inicialización para desarrollo
db.inicializar = async (force = false) => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
    
    await db.sequelize.sync({ force: force });
    console.log(`✅ Base de datos sincronizada (force: ${force})`);
    
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    throw error;
  }
};

module.exports = db;
