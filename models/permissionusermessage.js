'use strict';
module.exports = (sequelize, DataTypes) => {
  const PermissionUserMessage = sequelize.define('PermissionUserMessage', {
    user_id: DataTypes.INTEGER,
    message_id: DataTypes.INTEGER
  }, {
    tableName: 'permission_user_messages',
    underscored: true
  });
  PermissionUserMessage.associate = function(models) {
    // associations can be defined here
    PermissionUserMessage.belongsTo(models.User,{foreignKey:"userId"})
    PermissionUserMessage.belongsTo(models.Message,{foreignKey:"messageId"})
  };

  PermissionUserMessage.register = async function(input){
    return this.create(input)
  }
  return PermissionUserMessage;
};