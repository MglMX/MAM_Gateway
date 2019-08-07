'use strict';

const bcrypt = require("bcrypt");
const SALT_ROUNDS = 12;
const jwt = require("jsonwebtoken");
const secret = require("../config/jwtConfig").secret

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    tableName: 'users',
    underscored: true
  });
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Channel, {as : "channels",foreignKey : "user_id"})
    User.belongsToMany(models.Group, {through: 'UserGroup', foreignKey: 'user_id', as: 'groups'})    
    User.belongsToMany(models.Channel, {through: 'PermissionUserChannel', foreignKey: 'user_id',as: 'accessibleChannels'})
    User.belongsToMany(models.Message, {through: 'PermissionUserMessage', foreignKey: 'user_id',as: 'accessibleMessages'})
  };

  /**
   * Registers a new user
   * @param {Object} input - Input object containing email and password
   * @returns {Promise} - Resolves to a new user
   */
  User.register = async function(input) {
    const { name, email, password } = input;

    const existingUser = await this.count({ where: { email } });

    if (existingUser) {
      throw new Error("A user with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    return this.create({ name, email, password: hashedPassword });
  };

  User.prototype.verifyPassword = async function(password) {

    const hash = await bcrypt.hash(password, SALT_ROUNDS);  

    return this.password === hash;
  }

  User.prototype.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        email: this.email,
        id: this.id,
        exp: parseInt(expirationDate.getTime() / 1000, 10)
      },
      secret
    );
  };

  User.prototype.toAuthJSON = function() {
    return {
      id: this.id,
      email: this.email,
      token: this.generateJWT()
    };
  };

  return User;
};