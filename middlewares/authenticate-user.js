const { UnauthenticatedError } = require('../errors');
const { isValidToken } = require('../helpers/auth');

const authenticateUser = async (req, res, next) => {
  let token;
  /** Check request header for token */
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies.token) {
    /** Check cookies if token exists */
    token = req.cookies.token;
  }
  if (!token) {
    throw new UnauthenticatedError('Access denied. No token provided');
  }

  try {
    /** Assign decoded token as payload send expiration message */
    const msg = 'Token expiration time has elapsed';
    const payload = isValidToken(token, msg);

    req.user = payload;

    next();
  } catch (error) {
    throw new UnauthenticatedError('Invalid authentication token');
  }
};

module.exports = {
  authenticateUser,
};
