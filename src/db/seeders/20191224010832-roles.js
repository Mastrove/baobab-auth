const crypto = require('crypto');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const scopes = ['read_user', 'write_user', 'read_role', 'write_role', 'read_pod', 'write_pod'];

    await queryInterface.bulkInsert('Roles', [
      {
        id: 'role_default_user',
        name: 'default user',
        type: 'organization',
        scopes: ['read_pod', 'write_pod'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'role_default_admin',
        name: 'default admin',
        type: 'organization',
        scopes: ['read_pod', 'write_pod', 'read_user', 'write_user'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    return true;
  },

  down: (queryInterface) => queryInterface.bulkDelete('Roles', null, {}),
};
