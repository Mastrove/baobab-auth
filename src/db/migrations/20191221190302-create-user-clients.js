const constraints = require('../database-constraints');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserClients', {
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

    await queryInterface.addConstraint('UserClients', ['userId'], {
      type: 'foreign key',
      name: constraints.USER_CLIENT_USER_FKEY,
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    await queryInterface.addConstraint('UserClients', ['organizationId'], {
      type: 'foreign key',
      name: constraints.USER_CLIENT_ORG_FKEY,
      references: {
        table: 'Organizations',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    await queryInterface.addConstraint('UserClients', ['clientId'], {
      type: 'foreign key',
      name: constraints.USER_CLIENT_CLIENT_FKEY,
      references: {
        table: 'Clients',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    await queryInterface.addConstraint('UserClients', ['roleId'], {
      type: 'foreign key',
      name: constraints.USER_CLIENT_ROLE_FKEY,
      references: {
        table: 'Roles',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    await queryInterface.addConstraint('UserClients', ['userId', 'organizationId', 'clientId'], {
      type: 'unique',
      name: constraints.USER_CLIENT_ORG_UNIQUE,
    });

    return true;
  },

  down: (queryInterface, Sequelize) => queryInterface.dropTable('UserOrganizations'),
};
