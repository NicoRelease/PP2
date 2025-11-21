// Configuración de la base de datos para diferentes entornos

const config = {
  development: {
    dialect: 'sqlite',
    storage: './database/lms_dev.sqlite3', // Mejor organización en carpeta database
    logging: console.log, // Logs solo en desarrollo
    define: {
      freezeTableName: true, // Evita pluralización automática
      timestamps: false // Usamos nuestros propios campos de timestamp
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    dialect: 'sqlite',
    storage: './database/lms_test.sqlite3',
    logging: false,
    define: {
      freezeTableName: true,
      timestamps: false
    }
  },
  production: {
    dialect: 'sqlite', // En producción puedes cambiar a PostgreSQL/MySQL
    storage: './database/lms_prod.sqlite3',
    logging: false,
    define: {
      freezeTableName: true,
      timestamps: false
    },
    pool: {
      max: 20,
      min: 5,
      acquire: 60000,
      idle: 20000
    }
  }
};

// Determinar el entorno actual
const environment = process.env.NODE_ENV || 'development';

module.exports = config[environment];
