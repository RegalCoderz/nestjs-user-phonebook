'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Contacts', 
        'avatar_path', {
          type: Sequelize.STRING,
          allowNull: true
        }
      )
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Contacts', 'avatar_path')
    ]);
  }
};
