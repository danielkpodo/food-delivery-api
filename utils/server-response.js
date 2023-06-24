const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const handleJoiError = (res, error) => {
  return res.status(StatusCodes.BAD_REQUEST).json({
    status_code: StatusCodes.BAD_REQUEST,
    status_message: ReasonPhrases.BAD_REQUEST,
    error: error.details[0].message,
  });
};

module.exports = {
  handleJoiError,
};
