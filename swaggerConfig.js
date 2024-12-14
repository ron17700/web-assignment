const swaggerJsDoc = require('swagger-jsdoc');

// Swagger definition options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0', // Specify the OpenAPI version
    info: {
      title: 'Your API Documentation', // Title for the API documentation
      version: '1.0.0', // API version
      description: 'This is the API documentation for your server.',
    },
    servers: [
      {
        url: 'http://localhost:3001', // Base URL for your APIs
        description: 'Local server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to your API route files
};

// Export the Swagger spec
const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
