'use strict';
module.exports = (sequelize, DataTypes) => {
  const Schema = sequelize.define('Schema', {
    name: DataTypes.STRING,    
  }, {
    tableName: 'schemas',
    underscored: true
  });
  Schema.associate = function(models) {
    Schema.hasMany(models.Channel, {as : "channels",foreignKey : "user_id"})
    // associations can be defined here
  };
  Schema.register = async function(input){
    return this.create(input)
  }
  return Schema;
};