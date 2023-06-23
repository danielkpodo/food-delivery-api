const { StatusCodes, ReasonPhrases } = require('http-status-codes');

/* eslint-disable no-unused-vars */
const errorHandler = (err, req, res, next) => {
  console.error(err);
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg:
      err.message || 'Oops! An error occurred whilst processing your request',
    statusMessage: err.statusMessage || ReasonPhrases.INTERNAL_SERVER_ERROR,
  };

  /** Handle all generic validations */
  if (err.name === 'SequelizeValidationError') {
    customError.msg = Object.values(err.errors)
      .map(item => item.message)
      .join(',');
    customError.statusCode = 400;
    customError.statusMessage = ReasonPhrases.BAD_REQUEST;
  }

  /** Prevent duplicate values in db */
  if (err.name === 'SequelizeUniqueConstraintError') {
    customError.msg = Object.values(err.errors)
      .map(item => item.message)
      .join(',');
    customError.statusCode = 400;
    customError.statusMessage = ReasonPhrases.BAD_REQUEST;
  }

  const errors = customError.msg.split(',');
  errors.map(error => {
    if (error) {
      return res.status(customError.statusCode).json({
        statusCode: customError.statusCode,
        statusMessage: customError.statusMessage,
        message: error,
      });
    }
  });
};

module.exports = errorHandler;
