const Joi = require('joi');

const validateMenu = (data) => {
  const schema = Joi.object({
    restaurantId: Joi.number().required().label('Restaurant Id'),
    itemName: Joi.string().required().label('Item name'),
    price: Joi.number().required().label('Price'),
  });
  return schema.validate(data);
};

module.exports = {
  validateMenu,
};
