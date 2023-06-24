const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const { sequelize, Sequelize, Restaurant } = require('../db/models');

const { handleJoiError } = require('../utils/server-response');
const { validateRestaurant } = require('../validators/restaurant');
const { NotFoundError } = require('../errors');
const checkPermission = require('../utils/checkPermission');

exports.getAllRestaurants = async (req, res) => {
  res.send('All Restaurants');
};

exports.createRestaurant = async (req, res) => {
  const { error } = validateRestaurant(req.body);
  if (error) {
    return handleJoiError(res, error);
  }

  await sequelize.transaction(async (t) => {
    const restaurant = await Restaurant.create(
      { ...req.body, ownerId: req.user.id },
      { transaction: t }
    );
    res.status(StatusCodes.CREATED).json({
      statusCode: StatusCodes.CREATED,
      statusMessage: ReasonPhrases.CREATED,
      data: { ...restaurant.toJSON() },
    });
  });
};

exports.updateRestaurant = async (req, res) => {
  // admins can update record and owners
  const { id } = req.params;
  const restaurant = await Restaurant.findOne({ where: { id } });
  await sequelize.transaction(async (t) => {
    if (!restaurant) {
      throw new NotFoundError(`Restaurant ID -> ${id} does not exist`);
    }
    checkPermission(req.user, restaurant);
    const updatedRestaurant = await Restaurant.update(
      { ...req.body },
      { where: { id }, returning: true, plain: true },
      { transaction: t }
    );
    const result = updatedRestaurant[1];

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      statusMessage: ReasonPhrases.OK,
      data: { ...result.toJSON() },
    });
  });
};

exports.deleteRestaurant = async (req, res) => {
  console.log(req.user);
  const { id } = req.params;
  const restaurant = await Restaurant.findOne({ where: { id } });
  await sequelize.transaction(async (t) => {
    if (!restaurant) {
      throw new NotFoundError(`Restaurant ID -> ${id} does not exist`);
    }

    // only system admins and resource owners can delete a record
    checkPermission(req.user, restaurant);
    await Restaurant.destroy({ where: { id } }, { transaction: t });

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      statusMessage: ReasonPhrases.OK,
      message: `Restaurant ID -> ${id} deleted successfully`,
    });
  });
};
