import request from 'supertest';
import { app } from '../app';

describe('Auth Endpoints', () => {
  it('should get welcome message from /api', async () => {
    const res = await request(app).get('/api');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Welcome to Subhvivah API');
  });

  it('should return 401 for /api/auth/me without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
