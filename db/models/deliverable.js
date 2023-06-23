'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Deliverable extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Deliverable.belongsTo(models.Order, {
        foreignKey: 'orderId',
        targetKey: 'id',
        as: 'order',
      });
    }
  }
  Deliverable.init(
    {
      orderId: DataTypes.INTEGER,
      itemName: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      price: DataTypes.DOUBLE,
      totalAmt: DataTypes.DOUBLE,
    },
    {
      sequelize,
      modelName: 'Deliverable',
    }
  );
  return Deliverable;
};
