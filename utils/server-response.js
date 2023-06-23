const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const handleJoiError = (res, error) => {
  return res.status(StatusCodes.BAD_REQUEST).json({
    status_code: StatusCodes.BAD_REQUEST,
    status_message: ReasonPhrases.BAD_REQUEST,
    error: error.details[0].message,
  });
};

const handleSuccPostRequest = (res, msg) => {
  return res.status(StatusCodes.CREATED).json({
    statusCode: StatusCodes.CREATED,
    statusMessage: ReasonPhrases.CREATED,
    message: msg,
  });
};

const handleSuccResponse = (res, msg) => {
  return res.status(StatusCodes.OK).json({
    statusCode: StatusCodes.OK,
    statusMessage: ReasonPhrases.OK,
    message: msg,
  });
};

const handleSuccDataRequest = (res, data) => {
  return res.status(StatusCodes.OK).json({
    statusCode: StatusCodes.OK,
    statusMessage: ReasonPhrases.OK,
    data,
  });
};

module.exports = {
  handleJoiError,
  handleSuccPostRequest,
  handleSuccResponse,
  handleSuccDataRequest,
};
