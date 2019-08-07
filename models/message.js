'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    root: DataTypes.STRING,
    index: DataTypes.INTEGER,
    channelId: DataTypes.INTEGER
  }, {
    tableName: 'messages',
    underscored: true
  });
  Message.associate = function(models) {
    Message.belongsTo(models.Channel, {foreignKey: 'channel_id', as: 'channel'})
    Message.hasMany(models.EncryptedData,{as : "encrypted",foreignKey : "message_id"})
    Message.belongsToMany(models.User, {through: 'PermissionUserMessage', foreignKey: 'message_id',as: 'permissionedUsers'})
    // associations can be defined here
  };

  Message.register = async function(input){
    return this.create(input)
  }
  return Message;
};