const request = require('supertest');
const app = require('../../src/app');

const factory = require('../utils/factories');
const truncate = require('../utils/truncate');

describe('Auth', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('not authenticate user with invalid email', async () => {
    const user = await factory.create('User', {
      email: 'nathan@gmail.com',
      password: '123456',
    });

    const response = await request(app)
      .post('/sessions')
      .send({ email: 'miles@gmail.com', password: user.password });

    expect(response.status).toBe(404);
  });

  it('not authenticate user with invalid password', async () => {
    const user = await factory.create('User', {
      email: 'drake@gmail.com',
      password: '123456',
    });

    const response = await request(app)
      .post('/sessions')
      .send({ email: user.email, password: '123123' });

    expect(response.status).toBe(404);
  });

  it('authenticate user with valid credentials', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .post('/sessions')
      .send({ email: user.email, password: user.password });

    expect(response.status).toBe(200);
  });

  it('generate token when authenticate', async () => {
    const { email, password } = await factory.create('User');

    const response = await request(app)
      .post('/sessions')
      .send({ email, password });

    expect(response.body).toHaveProperty('token');
  });

  it('not access private routes without token', async () => {
    const response = await request(app).get('/feed');

    expect(response.status).toBe(401);
  });

  it('not access private routes if token is invalid', async () => {
    const response = await request(app)
      .get('/feed')
      .set('Authorization', 'Bearer UP5g2bGOj5k2G3oEB2hP');

    expect(response.status).toBe(401);
  });

  it('access private routes if authenticated', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .get('/feed')
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });
});
