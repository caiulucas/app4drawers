const { User, Drawing } = require('../models');

module.exports = {
  async show(req, res) {
    const user_id = req.userId;
    const { drawing_id } = req.params;
    const user = await User.findByPk(user_id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const drawing = await Drawing.findByPk(drawing_id);
    if (!drawing) return res.status(404).json({ message: 'Drawing not found' });

    return res.status(200).json(drawing);
  },

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

  async update(req, res) {
    const { userId } = req;

    const user = await User.findByPk(userId);

    if (!user) return res.status(404).json('User not found');

    const { drawing_id } = req.params;
    const { description } = req.body;

    try {
      await Drawing.update(
        { description },
        { where: { id: drawing_id, user_id: userId } }
      );
      return res.status(200).send();
    } catch (err) {
      return res.status(400).json('Could not update drawing');
    }
  },

  async destroy(req, res) {
    const id = req.userId;
    const user = await User.findByPk(id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const { drawing_id } = req.params;

    try {
      await Drawing.destroy({
        where: { id: drawing_id, user_id: id },
      });
      return res.status(200).send();
    } catch (err) {
      return res.status(400).json('Drawing was not deleted');
    }
  },
};
