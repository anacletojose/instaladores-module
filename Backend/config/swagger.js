const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Instaladores',
      version: '1.0.0',
      description:
        'Documentación de la API para el sistema de gestión de instaladores y aplicativos. Incluye autenticación JWT y control de roles.',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Servidor local de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Autenticación con token JWT. Ejemplo: "Bearer <tu_token>"',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };