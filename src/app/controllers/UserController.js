const { User } = require('../models');

module.exports = {
  async index(req, res) {
    const users = await User.findAll();
    return res.json(users);
  },

  async store(req, res) {
    const { name, email, password } = req.body;

    await User.create({ name, email, password });

    return res.status(201).send();
  },

  async update(req, res) {
    const id = req.userId;
    const { bio, name, password } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).send();
    }

    try {
      await User.update({ avatar, bio, name, password }, { where: { id } });
    } catch (err) {
      return res.status(400).json({ message: 'Could not update user.' });
    }
    return res.status(200).send();
  },
};
