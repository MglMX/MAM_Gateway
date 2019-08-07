"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("messages", {
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
      index: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      channel_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "channels",
          key: "id"
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
    return queryInterface.dropTable("messages");
  }
};
