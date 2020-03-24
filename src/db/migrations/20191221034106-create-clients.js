const constraints = require('../database-constraints');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Clients', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      secret: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      redirectUrls: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },
      roleId: {
        type: Sequelize.STRING,
        allowNull: false,
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

    await queryInterface.addConstraint('Clients', ['roleId'], {
      type: 'foreign key',
      name: constraints.CLIENT_ROLE_FKEY,
      references: {
        table: 'Roles',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    return true;
  },

  down: (queryInterface) => queryInterface.dropTable('Clients'),
};
