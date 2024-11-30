const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Generate a token for a mock user
const userId = new mongoose.Types.ObjectId();
const token = 'Bearer ' + jwt.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: '1h' }
);

beforeEach(async () => {
  // Insert a mock user into the test database
  await User.create({
    _id: userId,
    username: 'testuser',
    email: 'testuser@example.com',
    firstName: 'Test',
    lastName: 'User',
    age: 25,
    password: 'hashedpassword'
  });
});

beforeAll(async () => {
  // Connect to the test database
  const testUri = process.env.MONGO_URI_TEST;
  if (!testUri) {
    throw new Error('MONGO_URI_TEST is not defined in the .env file');
  }
  await mongoose.connect(testUri, {});
});

afterAll(async () => {
  // Disconnect from the test database
  await mongoose.connection.close();
  
});

afterEach(async () => {
  // Clear the test database after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

module.exports = { token, userId };
