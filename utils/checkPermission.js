const { UnauthorizedError } = require('../errors');

const checkPermission = (requestUser, resourceId) => {
  if (requestUser.id === resourceId.ownerId) return;
  if (requestUser.role === 'ADMIN') return;

  throw new UnauthorizedError('You are not authorized to perform this action');
};

module.exports = checkPermission;
