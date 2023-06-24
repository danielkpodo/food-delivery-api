const { UnauthorizedError } = require('../errors');

const authorizePermissions = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    throw new UnauthorizedError(
      'You do not have the right access to perform this operation'
    );
  }
  next();
};

module.exports = {
  authorizePermissions,
};
