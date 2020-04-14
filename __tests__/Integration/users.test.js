const bcrypt = require('bcryptjs');
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
      name: 'Caio Lucas',
      email: 'lienscarlet@gmail.com',
      password: '123456',
    };

    const response = await request(app).post('/users').send(dataPayload);

    expect(response.status).toBe(201);
  });

  it('returns users index', async () => {
    await factory.create('User');

    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty('email');
  });

  it('update user when authenticated', async () => {
    const user = await factory.create('User', {
      name: 'Caio',
      password: 'pineapple',
    });

    const updateDataPayload = {
      name: 'Lien Scarlet',
      password: 'potato',
      password_confirmation: 'potato',
    };

    const response = request(app)
      .put(`/users/${user.id}`)
      .set('Authentication', `Bearer ${user.generateToken()}`)
      .send(updateDataPayload);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updateDataPayload.name);
  });

  it('creates hash password', async () => {
    const user = await factory.create('User', { password: '123456' });

    const comparedPassword = await bcrypt.compare('123456', user.password_hash);

    expect(comparedPassword).toBe(true);
  });
});
