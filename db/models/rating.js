/* eslint-disable no-unused-vars */

'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    static associate(models) {}
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
