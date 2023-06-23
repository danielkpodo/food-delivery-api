const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const AppError = require('./app-error');

class UnauthorizedError extends AppError {
  constructor(message, statusMessage) {
    super(message, statusMessage);
    this.statusCode = StatusCodes.FORBIDDEN;
    this.statusMessage = ReasonPhrases.FORBIDDEN;
  }
}

module.exports = UnauthorizedError;
