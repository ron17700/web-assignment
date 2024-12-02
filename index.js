const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const swaggerSetup = require('./swagger'); // Import the Swagger setup

require('dotenv').config({ path: path.join(__dirname, './.env') });
process.env.rootDir = __dirname;

const PORT = process.env.PORT || 3001;
const index = express();

index.use(express.json());
index.use(express.urlencoded({ extended: false }));
index.use('/' ,require('./routes/index'));

// Swagger documentation setup
swaggerSetup(index); // Call the Swagger setup]

module.exports = index;


const startServer = async () => {
  try {
    console.log('\nTrying to connect to mongoDB');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (exception) {
    console.error(exception.message);
    console.log(exception.stack);
  }
  index.listen(PORT, () => {
    console.log(`\nServer is listening on port: ${PORT} \n`);
    console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
  });
};

if ( require.main === module ) {
  console.log('Starting server from index.js');
  startServer();
}
