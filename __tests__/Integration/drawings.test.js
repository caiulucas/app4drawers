const path = require('path');
const request = require('supertest');
const app = require('../../src/app');

const factory = require('../utils/factories');
const truncate = require('../utils/truncate');

describe('Drawings', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('shows drawing from a user', async () => {
    const user = await factory.create('User');
    const drawing = await factory.attrs('Drawing');

    const newDrawing = await user.createDrawing(drawing);

    const response = await request(app)
      .get(`/drawings/show/${newDrawing.id}`)
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(newDrawing.id);
  });

  it('index drawings from a user', async () => {
    const user = await factory.create('User');
    const drawing = await factory.attrs('Drawing');
    await user.createDrawing(drawing);

    const response = await request(app)
      .get(`/drawings/${user.id}`)
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);

    expect(response.body[0]).toHaveProperty('drawing_url');
  });

  it('creates drawing', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .post('/drawings')
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .attach('drawing', path.resolve(__dirname, '..', 'images', 'drawing.jpg'))
      .field('description', 'Kono dio da!!!');

    expect(response.status).toBe(201);
  });

  it('updates drawing description', async () => {
    const user = await factory.create('User');
    const drawing = await factory.attrs('Drawing', { description: 'Desc' });

    const { dataValues } = await user.createDrawing(drawing);

    const response = await request(app)
      .put(`/drawings/${dataValues.id}`)
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send({ description: 'new desc' });

    expect(response.status).toBe(200);
  });

  it('deletes drawing', async () => {
    const user = await factory.create('User');
    const drawing = await factory.attrs('Drawing');

    const dataValues = await user.createDrawing(drawing);

    const response = await request(app)
      .delete(`/drawings/${dataValues.id}`)
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });
});
