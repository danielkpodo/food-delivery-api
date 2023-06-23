const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const AppError = require('./app-error');

class BadRequestError extends AppError {
  constructor(message, statusMessage) {
    super(message, statusMessage);
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.statusMessage = ReasonPhrases.BAD_REQUEST;
  }
}

module.exports = BadRequestError;
