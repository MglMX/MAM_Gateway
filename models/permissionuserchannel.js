'use strict';
module.exports = (sequelize, DataTypes) => {
  const PermissionUserChannel = sequelize.define('PermissionUserChannel', {
    userId: DataTypes.INTEGER,
    channelId: DataTypes.INTEGER
  }, {
    tableName: 'permission_user_channels',
    underscored: true
  });
  PermissionUserChannel.associate = function(models) {
    // associations can be defined here
    PermissionUserChannel.belongsTo(models.User,{foreignKey:"userId"})
    PermissionUserChannel.belongsTo(models.Channel,{foreignKey:"channelId"})
  };

  PermissionUserChannel.register = async function(input){
    return this.create(input)
  }
  return PermissionUserChannel;
};