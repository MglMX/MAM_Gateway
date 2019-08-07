'use strict';
module.exports = (sequelize, DataTypes) => {
  const PermissionGroupChannel = sequelize.define('PermissionGroupChannel', {
    group_id: DataTypes.INTEGER,
    channel_id: DataTypes.INTEGER
  }, {
    tableName: 'permission_group_channels',
    underscored: true
  });
  PermissionGroupChannel.associate = function(models) {
    // associations can be defined here
    PermissionGroupChannel.belongsTo(models.Group,{foreignKey:"group_id"})
    PermissionGroupChannel.belongsTo(models.Channel,{foreignKey:"channel_id"})
  };

  PermissionGroupChannel.register = async function(input){
    return this.create(input)
  }
  return PermissionGroupChannel;
};