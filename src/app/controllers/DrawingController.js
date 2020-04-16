const { User, Drawing } = require('../models');

module.exports = {
  async index(req, res) {
    const { user_id } = req.params;

    const drawings = await Drawing.findAll({ where: { user_id } });

    if (!drawings)
      return res.status(404).json({ message: 'Drawings not found' });

    return res.status(200).json(drawings);
  },

  async store(req, res) {
    const id = req.userId;

    const user = await User.findByPk(id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const { description } = req.body;
    const drawingImg = req.file.filename;

    const drawing = await user.createDrawing({
      description,
      drawing: drawingImg,
    });

    return res.status(201).json(drawing);
  },

  async destroy(req, res) {
    const id = req.userId;

    const user = await User.findByPk(id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const { drawing_id } = req.params;

    const destroyed = await Drawing.destroy({ where: { id: drawing_id } });
    if (!destroyed) return res.status(400).json('Drawing was not deleted');
    return res.status(200).send();
  },
};
