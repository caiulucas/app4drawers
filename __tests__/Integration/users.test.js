const bcrypt = require('bcryptjs');
const path = require('path');
const request = require('supertest');
const app = require('../../src/app');

const truncate = require('../utils/truncate');
const factory = require('../utils/factories');

describe('Users', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('creates user', async () => {
    const dataPayload = {
      name: 'Josh',
      email: 'josh@gmail.com',
      password: '123456',
    };

    const response = await request(app).post('/users').send(dataPayload);

    expect(response.status).toBe(201);
  });

  it('not creates user if email already exists', async () => {
    await factory.create('User', { email: 'drake@gmail.com' });

    const dataPayload = {
      name: 'Drake',
      email: 'drake@gmail.com',
      password: '123456',
    };

    const response = await request(app).post('/users').send(dataPayload);

    expect(response.status).toBe(404);
  });

  it('returns users index', async () => {
    await factory.create('User');

    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty('email');
  });

  it('update user when authenticated', async () => {
    const user = await factory.create('User', {
      name: 'Josh',
      password: 'pineapple',
    });

    const response = await request(app)
      .put(`/users`)
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .attach('avatar', path.resolve(__dirname, '..', 'images', 'avatar.jpg'))
      .field('name', 'Drake')
      .field('bio', 'Hi, I am Drake and there are my drawings')
      .field('password', 'potato');

    expect(response.status).toBe(200);
  });

  it('creates hash password', async () => {
    const user = await factory.create('User', { password: '123456' });

    const comparedPassword = await bcrypt.compare('123456', user.password_hash);

    expect(comparedPassword).toBe(true);
  });
});
