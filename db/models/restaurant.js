'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    static associate(models) {
      Restaurant.hasMany(models.Order, {
        foreignKey: 'restaurantId',
        sourceKey: 'id',
        as: 'orders',
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
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      phone: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Restaurant',
    }
  );
  return Restaurant;
};
