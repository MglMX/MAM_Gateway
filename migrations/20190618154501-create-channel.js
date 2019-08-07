'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('channels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      root: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      secret: {
        type: Sequelize.STRING
      },
      seed: {
        type: Sequelize.STRING,
        allowNull: false
      },
      next_root: {
        type: Sequelize.STRING,
        allowNull: false
      },
      last_index: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      restricted: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {         
          model: 'users',
          key: 'id'
}
      },
      schema_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {         
          model: 'schemas',
          key: 'id'
        }
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('channels');
  }
};