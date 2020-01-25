const constraints = require('../database-constraints');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint('Users', ['email'], {
      type: 'unique',
      name: constraints.USERS_UNIQUE_EMAIL,
    });

    return true;
  },
  down: (queryInterface) => queryInterface.dropTable('Users'),
};
