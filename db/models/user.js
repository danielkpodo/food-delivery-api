'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Order, {
        foreignKey: 'ownerId',
        sourceKey: 'id',
        as: 'orders',
      });
    }
  }
  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'Email is already taken',
        },
      },
      password: DataTypes.STRING,
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'Phone number already exists',
        },
      },
      role: {
        type: DataTypes.ENUM,
        defaultValue: 'SUBSCRIBER',
        values: ['SUBSCRIBER', 'ADMIN'],
      },
      address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
