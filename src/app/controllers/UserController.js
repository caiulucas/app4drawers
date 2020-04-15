const { User } = require('../models');

module.exports = {
  async index(req, res) {
    const users = await User.findAll();

    return res.json(users);
  },

  async store(req, res) {
    const { name, email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user) {
      return res.status(404).json({ message: 'email already exists' });
    }

    const newUser = await User.create({ name, email, password });

    return res.status(201).json(newUser);
  },

  async update(req, res) {
    const id = req.userId;

    const avatar = req.file.filename;
    const { bio, name, password } = req.body;

    try {
      await User.update(
        { avatar, bio, name, password },
        { where: { id }, individualHooks: true }
      );

      return res.status(200).send();
    } catch (err) {
      return res.status(400).json({ message: 'Could not update user.' });
    }
  },
};
