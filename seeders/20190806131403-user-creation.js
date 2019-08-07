'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users',[{
      name: 'Alice',
      email: 'alice@gmail.com',
      password: '$2b$12$1Fey67I0qWKDjgKDxNvxs.8XrlzobYsfmTuKpKpufyISrjbnlsE8S',
      role: 'USER',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW'),
    },{
      name: 'Bob',
      email: 'bob@gmail.com',
      password: '$2b$12$1Fey67I0qWKDjgKDxNvxs.8XrlzobYsfmTuKpKpufyISrjbnlsE8S',
      role: 'USER',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW'),
    },
    {
      name: 'Charlie',
      email: 'charlie@gmail.com',
      password: '$2b$12$1Fey67I0qWKDjgKDxNvxs.8XrlzobYsfmTuKpKpufyISrjbnlsE8S',
      role: 'USER',
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
    return queryInterface.bulkDelete('users',{where : {name : ["Alice","Bob","Charlie"]}}, {});
    
  }
};
