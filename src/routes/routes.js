const { Router } = require('express');
const { UserController, SessionController } = require('../app/controllers');
const { auth, imgUpload } = require('../app/middlewares');

const routes = Router();
routes.get('/users', UserController.index);
routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

routes.use(auth);

routes.put('/users', imgUpload.single('avatar'), UserController.update);

routes.get('/feed', (req, res) => {
  return res.status(200).send();
});
module.exports = routes;
