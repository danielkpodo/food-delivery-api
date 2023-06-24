const Joi = require('joi');
const { isMobilePhone } = require('../helpers/generic-functions');

const validateRestaurant = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label('Restaurant name'),
    address: Joi.string().required().label('Address'),
    phone: Joi.string()
      .required()
      .custom((value, helper) => {
        // eslint-disable-next-line no-undef
        if (!isMobilePhone(value)) {
          return helper.message('Phone number format is inaccurate');
        }
      }),
  });
  return schema.validate(data);
};

module.exports = {
  validateRestaurant,
};
