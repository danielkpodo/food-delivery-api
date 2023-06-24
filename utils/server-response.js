const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const handleJoiError = (res, error) => {
  return res.status(StatusCodes.BAD_REQUEST).json({
    statusCode: StatusCodes.BAD_REQUEST,
    statusMessage: ReasonPhrases.BAD_REQUEST,
    message: error.details[0].message,
  });
};

module.exports = {
  handleJoiError,
};
