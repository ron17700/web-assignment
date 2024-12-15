const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

// Load all the individual YAML files
const components = YAML.load(path.join(__dirname, 'components.yaml'));
const posts = YAML.load(path.join(__dirname, 'posts.yaml'));
const comments = YAML.load(path.join(__dirname, 'comments.yaml'));
const users = YAML.load(path.join(__dirname, 'users.yaml'));

// Merge all paths and components
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'Comprehensive API documentation for all endpoints',
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Local server',
    },
  ],
  paths: {
    ...posts.paths,
    ...comments.paths,
    ...users.paths,
  },
  components: components.components,
};

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
