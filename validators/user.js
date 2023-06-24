const Joi = require('joi');
const { isMobilePhone } = require('../helpers/generic-functions');

const validateSignUp = (data) => {
  const schema = Joi.object({
    firstName: Joi.string()
      .regex(/^[a-zA-Z ]+$/)
      .message('Only alphabet characters allowed in firstname')
      .required(),
    lastName: Joi.string()
      .regex(/^[a-zA-Z ]+$/)
      .message('Only alphabet characters allowed in lastname')
      .required(),
    email: Joi.string()
      .email()
      .message('Invalid email address format')
      .required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required(),
    phone: Joi.string()
      .required()
      .custom((value, helper) => {
        // eslint-disable-next-line no-undef
        if (!isMobilePhone(value)) {
          return helper.message('Phone number format is inaccurate');
        }
      }),
    address: Joi.string().required(),
    role: Joi.string().valid('SUBSCRIBER', 'ADMIN'),
  });

  return schema.validate(data);
};

const verifyPasswords = (password, confirmPassword) => {
  return password === confirmPassword;
};

const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().message('Invalid email format').required(),
    password: Joi.string().required().label('Password'),
  });
  return schema.validate(data);
};

module.exports = {
  validateSignUp,
  verifyPasswords,
  validateLogin,
};
