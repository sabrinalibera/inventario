const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const flash = require('connect-flash');

const app = express();
const PORT = 3000;

// Importar rutas
const authRoutes = require('./routes/auth');
const inventoryRoutes = require('./routes/inventory');

// Configuración de vistas y CSS
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar sesiones
app.use(session({
  secret: 'secretKey',   // En la realida haría falta una clave secreta más fuerte
  resave: false,         // No guardar sesión si no hay cambios
  saveUninitialized: false, // No guardar sesiones vacías
  cookie: { secure: false } // false = sitio no usa HTTPS, de lo contrario true
}));

app.use(flash());

// Middleware para pasar los mensajes flash a las vistas
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Redirigir la ruta raíz '/' al login
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Rutas
app.use('/', authRoutes);
app.use('/inventory', inventoryRoutes);

// Servidor escuchando
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});