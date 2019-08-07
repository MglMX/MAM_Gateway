'use strict';
module.exports = (sequelize, DataTypes) => {
  const Channel = sequelize.define('Channel', {
    root: DataTypes.STRING,
    secret: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    schemaId: DataTypes.INTEGER,
    restricted: DataTypes.BOOLEAN,
    seed: DataTypes.STRING,
    nextRoot: {type : DataTypes.STRING, field: "next_root"},
    lastIndex: {type: DataTypes.INTEGER, field: "last_index"}
  }, {tableName:'channels',underscored: true});
  Channel.associate = function(models) {
    // associations can be defined here
    Channel.belongsTo(models.User, {foreignKey: 'user_id', as: 'owner'})
    Channel.belongsTo(models.Schema, {foreignKey: 'schema_id', as: 'schema'})
    Channel.hasMany(models.Message,{as : "messages",foreignKey : "channel_id"})
    Channel.belongsToMany(models.User,{through: 'PermissionUserChannel',foreignKey:'channel_id',as:'permissionedUsers'})
    Channel.belongsToMany(models.Group,{through: 'PermissionGroupChannel',foreignKey:'channel_id',as:'permissionedGroups'})
  };

  Channel.register = async function(input){
    return this.create(input)
  }
  return Channel;
};