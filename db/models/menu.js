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

      Menu.belongsTo(models.User, {
        foreignKey: 'ownerId',
        targetKey: 'id',
        as: 'owner',
      });
    }
  }
  Menu.init(
    {
      restaurantId: DataTypes.INTEGER,
      itemName: DataTypes.STRING,
      price: DataTypes.DOUBLE,
      ownerId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'Menu',
    }
  );
  return Menu;
};
