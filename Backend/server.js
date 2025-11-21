const express = require('express');
const cors = require('cors');
const db = require('./models');
const path = require('path');
const fs = require('fs');

const app = express();

// Crear carpeta database si no existe
const databaseDir = path.join(__dirname, 'database');
if (!fs.existsSync(databaseDir)) {
  fs.mkdirSync(databaseDir, { recursive: true });
  console.log('📁 Carpeta database creada');
}

// Middlewares
app.use(cors());
app.use(express.json());

// Logging de requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Inicialización de la BD
const inicializarBD = async () => {
  try {
    // TEMPORAL: Usar force: true para recrear tablas con las nuevas asociaciones
    // Luego cambiar a false
    const force = false; // Cambiar a false después del primer run
    
    await db.sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');
    
    await db.sequelize.sync({ force });
    console.log(`✅ Base de datos sincronizada (force: ${force})`);
    
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    process.exit(1);
  }
};

// Rutas
app.use('/api', require('./routes/sesiones.routes'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Ruta no encontrada',
    endpoint: req.originalUrl,
    method: req.method
  });
});

// Middleware global de manejo de errores
app.use((error, req, res, next) => {
  console.error('🔥 Error no manejado:', error);
  res.status(500).json({ 
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Contacte al administrador'
  });
});

const PORT = process.env.PORT || 3001;

// Iniciar servidor después de inicializar la BD
inicializarBD().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor Express escuchando en http://localhost:${PORT}`);
    console.log(`📚 API disponible en http://localhost:${PORT}/api`);
    console.log(`❤️  Health check - Conectado: http://localhost:${PORT}/health`);
  });
}).catch(error => {
  console.error('❌ No se pudo iniciar el servidor:', error);
});
