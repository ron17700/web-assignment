import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJsDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Documentation',
      version: '1.0.0',
      description: 'This is the API documentation for your server.',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Local server',
      },
    ],
  },
  apis: ['./routes/*.ts'], // Path to your API route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export default swaggerDocs;