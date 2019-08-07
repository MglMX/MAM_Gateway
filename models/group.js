'use strict';
module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    name: DataTypes.STRING
  }, {
    tableName: 'groups',
    underscored: true
  });
  Group.associate = function(models) {
    Group.belongsToMany(models.User, {through: 'UserGroup', foreignKey: 'groupId', as: 'users'})
    Group.belongsToMany(models.Channel, {through: 'PermissionGroupChannel', foreignKey: 'groupId', as: 'channels'})
    // associations can be defined here
  };
  Group.register = async function(input){
    return this.create(input)
  }
  return Group;
};