const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../index.js'); // Your app's entry point
const User = require('../../models/user.model');
const { token } = require('../setup'); // Import token and userId
  
it('should get all users', async () => {
// Create a user
const user = await User.create({
    username: 'testing',
    email: 'testing@example.com',
    firstName: 'TestFirstname',
    lastName: 'TestLastname',
    age: 99,
    password: 'hashedpassword',
});

const res = await request(app)
    .get('/user')
    .set('Authorization', token);

expect(res.statusCode).toBe(200);
expect(Array.isArray(res.body)).toBe(true);
expect(res.body.length).toBe(2); // inclduing the mock user created in setup.js
});

it('should fetch a user by ID', async () => {
// Create a user
const user = await User.create({
    username: 'testing',
    email: 'testing@example.com',
    firstName: 'TestFirstname',
    lastName: 'TestLastname',
    age: 99,
    password: 'hashedpassword',
});

const res = await request(app)
    .get(`/user/${user._id}`)
    .set('Authorization', token);

expect(res.statusCode).toBe(200);
expect(res.body._id).toBe(user._id.toString());
expect(res.body.username).toBe('testing');
});

it('should return 404 for a non-existent user', async () => {
  const fakeId = new mongoose.Types.ObjectId(); // Generate a fake ObjectId

  const res = await request(app)
    .get(`/user/${fakeId}`)
    .set('Authorization', token);

  expect(res.statusCode).toBe(404);
  expect(res.body.message).toBe('User not found');
});

it('should update a user with valid fields', async () => {
  // Create a user
  const user = await User.create({
    username: 'testing',
    email: 'testing@example.com',
    firstName: 'TestFirstname',
    lastName: 'TestLastname',
    age: 99,
    password: 'hashedpassword',
  });

  const res = await request(app)
    .put(`/user/${user._id}`)
    .set('Authorization', token)
    .send({
      firstName: 'UpdatedFirstName',
      lastName: 'UpdatedLastName',
      age: 30,
    });

  expect(res.statusCode).toBe(200);
  expect(res.body.message).toBe('User updated successfully');
  expect(res.body.user.firstName).toBe('UpdatedFirstName');
  expect(res.body.user.lastName).toBe('UpdatedLastName');
});

it('should return 400 when trying to update username or email', async () => {
  // Create a user
  const user = await User.create({
    username: 'testing',
    email: 'testing@example.com',
    firstName: 'TestFirstname',
    lastName: 'TestLastname',
    age: 99,
    password: 'hashedpassword',
  });

  const res = await request(app)
    .put(`/user/${user._id}`)
    .set('Authorization', token)
    .send({
      username: 'newusername',
      email: 'newemail@example.com',
    });

  expect(res.statusCode).toBe(400);
  expect(res.body.message).toBe('Updating username or email is not allowed');
});

it('should return 404 for updating a non-existent user', async () => {
  const fakeId = new mongoose.Types.ObjectId();

  const res = await request(app)
    .put(`/user/${fakeId}`)
    .set('Authorization', token)
    .send({
      firstName: 'UpdatedFirstName',
      lastName: 'UpdatedLastName',
    });

  expect(res.statusCode).toBe(404);
  expect(res.body.message).toBe('User not found');
});

it('should delete a user', async () => {
  // Create a user
  const user = await User.create({
    username: 'testing',
    email: 'testing@example.com',
    firstName: 'TestFirstname',
    lastName: 'TestLastname',
    age: 99,
    password: 'hashedpassword',
  });

  const res = await request(app)
    .delete(`/user/${user._id}`)
    .set('Authorization', token);

  expect(res.statusCode).toBe(200);
  expect(res.body.message).toBe('User deleted successfully');

  const deletedUser = await User.findById(user._id);
  expect(deletedUser).toBeNull();
});

it('should return 404 for deleting a non-existent user', async () => {
  const fakeId = new mongoose.Types.ObjectId();

  const res = await request(app)
    .delete(`/user/${fakeId}`)
    .set('Authorization', token);

  expect(res.statusCode).toBe(404);
  expect(res.body.message).toBe('User not found');
});
