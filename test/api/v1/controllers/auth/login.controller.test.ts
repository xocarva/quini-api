import express from 'express';
import request from 'supertest';
import { login } from '../../../../../src/api/v1/controllers';
import { errorHandler } from '../../../../../src/middlewares/';
import { authService } from '../../../../../src/api/v1/services';
import { DatabaseError, UnauthorizedError } from '../../../../../src/errors';

const app = express();
app.use(express.json());
app.post('/login', login);
app.use(errorHandler);

jest.mock('../../../../../src/api/v1/services', () => ({
  authService: {
    login: jest.fn(),
  },
}));

describe('Login Controller', () => {

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should respond with a token if the login is successful', async () => {
    (authService.login as jest.Mock).mockResolvedValue('mocked-token');

    const response = await request(app).post('/login').send({
      email: 'testuser@email.com',
      password: 'testpassword',
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ token: 'mocked-token' });
    expect(authService.login).toHaveBeenCalledWith({
      email: 'testuser@email.com',
      password: 'testpassword',
    });
  });

  it('should forward the error if the login fails', async () => {
    (authService.login as jest.Mock).mockRejectedValue(
      new UnauthorizedError('Invalid credentials'),
    );

    const response = await request(app).post('/login').send({
      email: 'testuser@email.com',
      password: 'wrongpassword',
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual(expect.objectContaining({ message: 'Invalid credentials' }));
  });

  it('should return 422 if the request body is malformed', async () => {
    const response = await request(app).post('/login').send({
      email: 'testuser',
      password: 'short',
    });

    expect(response.status).toBe(422);
    expect(response.body.message).toContain('email');
  });

  it('should return 500 if there is a database error', async () => {
    (authService.login as jest.Mock).mockRejectedValue(new DatabaseError('Database error'));

    const response = await request(app).post('/login').send({
      email: 'testuser@email.com',
      password: 'testpassword',
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Database error');
  });

});
