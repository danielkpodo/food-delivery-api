'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    static associate(models) {
      Menu.belongsTo(models.Restaurant, {
        foreignKey: 'restaurantId',
        targetKey: 'id',
        as: 'restaurant',
      });
    }
  }
  Menu.init(
    {
      restaurantId: DataTypes.INTEGER,
      itemName: DataTypes.STRING,
      price: DataTypes.DOUBLE,
    },
    {
      sequelize,
      modelName: 'Menu',
    }
  );
  return Menu;
};
