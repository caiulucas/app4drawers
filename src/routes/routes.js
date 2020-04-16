const { Router } = require('express');
const {
  UserController,
  SessionController,
  DrawingController,
} = require('../app/controllers');
const { auth, imgUpload, drawingUpload } = require('../app/middlewares');

const routes = Router();
routes.get('/users', UserController.index);
routes.post('/users', UserController.store);
routes.put('/users', auth, imgUpload.single('avatar'), UserController.update);

routes.post('/sessions', SessionController.store);

routes.use(auth);

routes.get('/drawings/show/:drawing_id', DrawingController.show);
routes.get('/drawings/:user_id', DrawingController.index);
routes.post(
  '/drawings',
  drawingUpload.single('drawing'),
  DrawingController.store
);
routes.put('/drawings/:drawing_id', DrawingController.update);
routes.delete('/drawings/:drawing_id', DrawingController.destroy);

routes.get('/feed', (req, res) => {
  return res.status(200).send();
});
module.exports = routes;
