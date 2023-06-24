const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const { handleJoiError } = require('../utils/server-response');
const { validateSignUp, verifyPasswords } = require('../validators/user');
const { sequelize, User } = require('../db/models');
const { BadRequestError } = require('../errors');

const { encryptPassword, createAuthToken } = require('../helpers/auth');

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

exports.signin = async (req, res) => {};
