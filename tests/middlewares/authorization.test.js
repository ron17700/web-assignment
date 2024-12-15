const isAuthorized = require('../../middlewares/authorization');
const { token } = require('../setup');
const jwt = require('jsonwebtoken');

it('isAuthorized should return 403 if no authorization header is provided', async () => {
  const req = {
    headers: {}
  };

  const res = {
    statusCode: null,
    body: {},
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
    }
  };

  const next = jest.fn();

  await isAuthorized(req, res, next);

  expect(res.statusCode).toBe(403);
  expect(res.body.error).toBe('Authorization header not found!');
});

it('isAuthorized should return 403 if the user is not found in the database', async () => {
  const req = {
    headers: {
      authorization: token
    }
  };

  const res = {
    statusCode: null,
    body: {},
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
    }
  };

  const next = jest.fn();

  jest.spyOn(jwt, 'verify').mockReturnValue({ userId: 'non_existent_user_id' });

  await isAuthorized(req, res, next);

  expect(res.statusCode).toBe(403);
  expect(res.body.error).toBe('Not Authorized!');

  jwt.verify.mockRestore();
});
