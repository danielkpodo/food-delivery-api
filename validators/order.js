const Joi = require('joi');

const validateOrder = (data) => {
  const schema = Joi.object({
    items: Joi.array()
      .items(
        Joi.object({
          quantity: Joi.number().required(),
          menuId: Joi.number().required(),
        })
      )
      .required(),
  });
  return schema.validate(data);
};

const validateOrderStatus = (data) => {
  const schema = Joi.object({
    deliveryStatus: Joi.string().valid('PENDING', 'DELIVERED', 'CANCELLED'),
  });
  return schema.validate(data);
};

module.exports = {
  validateOrder,
  validateOrderStatus,
};
