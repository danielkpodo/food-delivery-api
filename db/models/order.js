'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: 'ownerId',
        targetKey: 'id',
        as: 'owner',
      });

      Order.hasMany(models.Deliverable, {
        foreignKey: 'orderId',
        as: 'deliverables',
      });
    }
  }
  Order.init(
    {
      ownerId: DataTypes.INTEGER,
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
