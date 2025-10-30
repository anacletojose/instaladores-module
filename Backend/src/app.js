require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { swaggerUi, swaggerSpec } = require('../config/swagger');


const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const aplicativosRoutes = require('./routes/aplicativos.routes');
app.use('/api/aplicativos', aplicativosRoutes);

const instaladoresRoutes = require('./routes/instaladores.routes');
app.use('/api/instaladores', instaladoresRoutes);

const usuariosRoutes = require('./routes/usuarios.routes');
app.use('/api/usuarios', usuariosRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'API del módulo Instaladores funcionando' });
});

module.exports = app;

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));