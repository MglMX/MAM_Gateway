'use strict';
module.exports = (sequelize, DataTypes) => {
  const EncryptedData = sequelize.define('EncryptedData', {
    messageId: DataTypes.INTEGER,
    hash: DataTypes.STRING,
    field: DataTypes.STRING,
    salt: DataTypes.STRING,
    data: DataTypes.STRING,
    algorithm: DataTypes.STRING
  }, {
    tableName: 'encrypted_data',
    underscored: true
  });
  EncryptedData.associate = function(models) {
    // associations can be defined here
    EncryptedData.belongsTo(models.Message,{foreignKey: 'message_id', as: 'message'})
  };

  EncryptedData.register = async function(input){
    return await this.create(input)
  };

  return EncryptedData;
 
};