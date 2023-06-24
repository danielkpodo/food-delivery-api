const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const { handleJoiError } = require('../utils/server-response');
const {
  validateSignUp,
  verifyPasswords,
  validateLogin,
} = require('../validators/user');
const { sequelize, Sequelize, User } = require('../db/models');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const {
  encryptPassword,
  createAuthToken,
  comparePassword,
  attachCookiesToResponse,
} = require('../helpers/auth');

exports.register = async (req, res) => {
  const { error } = validateSignUp(req.body);
  if (error) {
    return handleJoiError(res, error);
  }

  const { password, confirmPassword } = req.body;
  if (!verifyPasswords(password, confirmPassword)) {
    throw new BadRequestError('Passwords do not match');
  }

  const hashedPassword = await encryptPassword(password);

  await sequelize.transaction(async (t) => {
    const user = await User.create(
      { ...req.body, password: hashedPassword },
      { transaction: t }
    );
    user.password = undefined;
    const token = createAuthToken(user);
    res.status(StatusCodes.CREATED).json({
      statusCode: StatusCodes.CREATED,
      statusMessage: ReasonPhrases.CREATED,
      data: { user, token },
    });
  });
};

exports.signIn = async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) {
    return handleJoiError(res, error);
  }
  const { email, password } = req.body;
  const { Op } = Sequelize;

  await sequelize.transaction(async (t) => {
    const user = await User.findOne({
      where: { email: { [Op.iLike]: email } },
      transaction: t,
    });

    if (!user) {
      throw new UnauthenticatedError('Invalid credentials');
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new UnauthenticatedError('Invalid credentials');
    }
    user.password = undefined;
    const token = createAuthToken(user);
    /** Set token into the user's browser cookie */
    attachCookiesToResponse(res, token);
    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      statusMessage: ReasonPhrases.OK,
      data: { user, token },
    });
  });
};

exports.signOut = async (req, res) => {
  /** Clear cookie and set=logout */
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });

  res.status(StatusCodes.OK).json({
    statusCode: StatusCodes.OK,
    statusMessage: ReasonPhrases.OK,
    message: 'Logout successfully',
  });
};
