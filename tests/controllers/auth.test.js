const request = require('supertest');
const app = require('../../index.js'); // Your app's entry point
const User = require('../../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { token, refreshToken, userId } = require('../setup'); // Import token and userId

it('should register a new user', async () => {
  const res = await request(app)
    .post('/auth/register')
    .send({
      username: 'john_doe',
      email: 'john.doe@example.com',
      password: 'securePassword123',
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
    });

  expect(res.statusCode).toBe(201);
  expect(res.body.message).toBe('User registered successfully');
  expect(res.body.newUser).toHaveProperty('_id');
  expect(res.body.newUser.email).toBe('john.doe@example.com');
});

it('should return 400 if email already exists', async () => {
  // Register the user once
  await User.create({
    username: 'john_doe',
    password: 'hashedPassword',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
  });

  const res = await request(app)
    .post('/auth/register')
    .send({
      username: 'john_doe2',
      password: 'securePassword123',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Smith',
      age: 25,
    });

  expect(res.statusCode).toBe(400);
});

it('should log in an existing user and return tokens', async () => {
  // Register the user
  const user = await User.create({
    username: 'john_doe',
    email: 'john.doe@example.com',
    password: await bcrypt.hash('securePassword123', 10),
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
  });

  const res = await request(app)
    .post('/auth/login')
    .send({
      email: 'john.doe@example.com',
      password: 'securePassword123',
    });

  expect(res.statusCode).toBe(200);
  expect(res.body.message).toBe('Login successful');
  expect(res.body).toHaveProperty('accessToken');
  expect(res.body).toHaveProperty('refreshToken');
});

it('should return 400 for invalid credentials', async () => {
  const res = await request(app)
    .post('/auth/login')
    .send({
      email: 'invalid@example.com',
      password: 'wrongPassword',
    });

  expect(res.statusCode).toBe(400);
  expect(res.body.error).toBe('Invalid credentials');
});

it('should log out a user and invalidate the refresh token', async () => {
  // Log in the user first
  // const user = await User.create({
  //   _id: userId,
  //   username: 'john_doe',
  //   email: 'john.doe@example.com',
  //   password: await bcrypt.hash('securePassword123', 10),
  //   firstName: 'John',
  //   lastName: 'Doe',
  //   age: 30,
  //   refreshToken: refreshToken, // Set the refresh token
  // });

  const res = await request(app)
    .post('/auth/logout')
    .set('Authorization', token)
    .send({ refreshToken });

  expect(res.statusCode).toBe(200);
  expect(res.body.message).toBe('Logged out successfully');

  const updatedUser = await User.findById(userId).select('+refreshToken');
  expect(updatedUser.refreshToken).toBeNull(); // Ensure refresh token is cleared
});

it('should return 400 for an invalid refresh token', async () => {
  
  const res = await request(app)
    .post('/auth/logout')
    .set('Authorization', token)
    .send({ refreshToken: 'invalidToken' });

  expect(res.statusCode).toBe(400);
  expect(res.body.error).toBe('Invalid refresh token');
});

it('should return 403 for an missing refresh token', async () => {
  
  const res = await request(app)
    .post('/auth/logout')
    .set('Authorization', token);

  expect(res.statusCode).toBe(403);
  expect(res.body.error).toBe('Refresh token required');
});

it('should refresh the access token', async () => {
  const user = await User.create({
    username: 'john_doe',
    email: 'john.doe@example.com',
    password: await bcrypt.hash('securePassword123', 10),
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    refreshToken: refreshToken, // Set the refresh token
  });

  const res = await request(app)
    .post('/auth/refresh-token')
    .send({ refreshToken });

  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty('accessToken');
});

it('should return 400 for an invalid or expired refresh token', async () => {
  const res = await request(app)
    .post('/auth/refresh-token')
    .send({ refreshToken: 'invalidToken' });

  expect(res.statusCode).toBe(400);
  expect(res.body.error).toBe('Invalid or expired refresh token');
});

it('should return 403 for an missing refresh token', async () => {
  const res = await request(app)
    .post('/auth/refresh-token');

  expect(res.statusCode).toBe(403);
  expect(res.body.error).toBe('Refresh token required');
});

it('should return 403 for an invalid refresh token', async () => {
  testRefreshToken = jwt.sign({ userId: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });
  const res = await request(app)
    .post('/auth/logout')
    .set('Authorization', token)
    .send({ testRefreshToken });

  expect(res.statusCode).toBe(403);
});