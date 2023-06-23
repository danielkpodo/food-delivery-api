const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const notFound = (req, res) => {
  return res.status(StatusCodes.NOT_FOUND).json({
    statusCode: StatusCodes.NOT_FOUND,
    statusMessage: ReasonPhrases.NOT_FOUND,
    message: `Endpoint '${req.url}' does not exist`,
  });
};

module.exports = notFound;
