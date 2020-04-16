module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('drawings', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      description: Sequelize.STRING,
      drawing_url: { type: Sequelize.STRING, allowNull: false },

      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('drawings');
  },
};
