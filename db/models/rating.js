'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    static associate(models) {
      Rating.hasMany(models.User, {
        foreignKey: 'userId',
      });
      Rating.hasMany(models.Restaurant, {
        foreignKey: 'restaurantId',
      });
    }
  }
  Rating.init(
    {
      userId: DataTypes.INTEGER,
      restaurantId: DataTypes.INTEGER,
      score: DataTypes.INTEGER,
      comment: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Rating',
    }
  );
  return Rating;
};
