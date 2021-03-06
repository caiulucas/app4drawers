/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      bio: DataTypes.STRING,
      avatar: DataTypes.VIRTUAL,
      avatar_url: DataTypes.STRING,
      email: DataTypes.STRING,
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
        beforeUpdate: (user) => {
          if (user.avatar) {
            user.avatar_url = `${process.env.APP_URL}/images/avatars/${user.avatar}`;
          }
        },
      },
    }
  );

  User.hasMany(sequelize.models.Drawing, {
    foreignKey: 'user_id',
    as: 'drawings',
  });

  User.prototype.checkPassword = function (password) {
    return bcrypt.compare(password, this.password_hash);
  };

  User.prototype.generateToken = function () {
    return jwt.sign({ id: this.id }, process.env.APP_SECRET);
  };

  return User;
};
