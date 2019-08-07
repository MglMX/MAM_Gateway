'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('schemas',[{
      name: 'time-registration.healthcare.schema.json',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW'),
    }])
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: (queryInterface, Sequelize) => {
    
      return queryInterface.bulkDelete('groups',{where : {name : "TestGroup"}}, {});
    
  }
};
