const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const AppError = require('./app-error');

class NotFoundError extends AppError {
  constructor(message, statusMessage) {
    super(message, statusMessage);
    this.statusCode = StatusCodes.NOT_FOUND;
    this.statusMessage = ReasonPhrases.NOT_FOUND;
  }
}

module.exports = NotFoundError;
