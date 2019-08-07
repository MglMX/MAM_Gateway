'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('groups',[{
      name: 'TestGroup',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW'),
    },{
      name: 'TestGroup2',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW'),
    }])
    
  },

  down: (queryInterface, Sequelize) => {
    
      return queryInterface.bulkDelete('groups',{where : {name : "TestGroup"}}, {});
    
  }
};
