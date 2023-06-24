'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id',
        as: 'user',
      });

      Order.belongsTo(models.Restaurant, {
        foreignKey: 'restaurantId',
        targetKey: 'id',
        as: 'restaurant',
      });

      Order.hasMany(models.Deliverable, {
        foreignKey: 'orderId',
        as: 'deliverables',
      });
    }
  }
  Order.init(
    {
      userId: DataTypes.INTEGER,
      restaurantId: DataTypes.INTEGER,
      orderTotal: DataTypes.DOUBLE,
      deliveryStatus: {
        type: DataTypes.ENUM,
        defaultValue: 'PENDING',
        values: ['PENDING', 'DELIVERED', 'CANCELLED'],
      },
    },
    {
      sequelize,
      modelName: 'Order',
    }
  );
  return Order;
};
