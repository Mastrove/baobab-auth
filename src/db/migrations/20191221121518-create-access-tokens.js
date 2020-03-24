const constraints = require('../database-constraints');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AccessTokens', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      organizationId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      clientId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expiresAt: {
        allowNull: false,
        type: Sequelize.DATE,
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

    await queryInterface.addConstraint('AccessTokens', ['userId'], {
      type: 'foreign key',
      name: constraints.ACCESS_TOKEN_USER_FKEY,
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    await queryInterface.addConstraint('AccessTokens', ['organizationId'], {
      type: 'foreign key',
      name: constraints.ACCESS_TOKEN_ORG_FKEY,
      references: {
        table: 'Organizations',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    await queryInterface.addConstraint('AccessTokens', ['clientId'], {
      type: 'foreign key',
      name: constraints.ACCESS_TOKEN_CLIENT_FKEY,
      references: {
        table: 'Clients',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    return true;
  },
  down: (queryInterface) => queryInterface.dropTable('AccessTokens'),
};
