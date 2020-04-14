const { User } = require('../models');

module.exports = {
  async index(req, res) {
    const users = await User.findAll();
    res.json(users);
  },

  async store(req, res) {
    const { name, email, password } = req.body;

    await User.create({ name, email, password });

    return res.status(201).send();
  },
};
