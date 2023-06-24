'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    static associate(models) {
      Restaurant.belongsTo(models.User, {
        foreignKey: 'ownerId',
        targetKey: 'id',
        as: 'owner',
      });

      Restaurant.hasMany(models.Menu, {
        foreignKey: 'restaurantId',
        sourceKey: 'id',
        as: 'menus',
      });
    }
  }
  Restaurant.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'Restaurant name already exists',
        },
      },
      address: DataTypes.STRING,
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'There is an existing restaurant with this phone number',
        },
      },
      ownerId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'Restaurant',
    }
  );
  return Restaurant;
};
