class AppError extends Error {
  constructor(message, statusMessage) {
    super(message, statusMessage);
  }
}

module.exports = AppError;
