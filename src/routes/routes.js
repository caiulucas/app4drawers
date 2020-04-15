const { Router } = require('express');
const multer = require('multer');
const { UserController, SessionController } = require('../app/controllers');
const { auth } = require('../app/middlewares');

const imgUpload = multer({ dest: 'uploads/images/avatars/' });

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
