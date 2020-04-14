const { Router } = require('express');
const { UserController, SessionController } = require('../app/controllers');

const routes = Router();

routes.get('/users', UserController.index);
routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

module.exports = routes;
