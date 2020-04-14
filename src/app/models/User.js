/* eslint-disable no-param-reassign */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      bio: DataTypes.STRING,
      avatar: DataTypes.STRING,
      email: DataTypes.STRING,
      token: DataTypes.VIRTUAL,
      password: DataTypes.VIRTUAL,
      password_hash: DataTypes.STRING,
    },
    {
      hooks: {
        beforeSave: async (user) => {
          if (user.password) {
            user.password_hash = await bcrypt.hash(user.password, 8);
          }
        },
      },
    }
  );

  User.prototype.checkPassword = function (password) {
    return bcrypt.compare(password, this.password_hash);
  };

  User.prototype.generateToken = function () {
    this.token = jwt.sign({ id: this.id }, process.env.APP_SECRET);
    return true;
  };

  return User;
};
