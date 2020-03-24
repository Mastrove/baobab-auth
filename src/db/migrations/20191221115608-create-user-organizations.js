const constraints = require('../database-constraints');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserOrganizations', {
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

    await queryInterface.addConstraint('UserOrganizations', ['userId'], {
      type: 'foreign key',
      name: constraints.USER_ORG_USER_FKEY,
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    await queryInterface.addConstraint('UserOrganizations', ['organizationId'], {
      type: 'foreign key',
      name: constraints.USER_ORG_ORG_FKEY,
      references: {
        table: 'Organizations',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    await queryInterface.addConstraint('UserOrganizations', ['roleId'], {
      type: 'foreign key',
      name: constraints.USER_ORG_ROLE_FKEY,
      references: {
        table: 'Roles',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    return true;
  },

  down: (queryInterface) => queryInterface.dropTable('UserOrganizations'),
};
