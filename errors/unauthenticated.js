const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const AppError = require('./app-error');

class UnauthenticatedError extends AppError {
  constructor(message, statusMessage) {
    super(message, statusMessage);
    this.statusCode = StatusCodes.UNAUTHORIZED;
    this.statusMessage = ReasonPhrases.UNAUTHORIZED;
  }
}

module.exports = UnauthenticatedError;
