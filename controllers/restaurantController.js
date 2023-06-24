const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const { sequelize, Sequelize, Restaurant, User } = require('../db/models');

const { handleJoiError } = require('../utils/server-response');
const { validateRestaurant } = require('../validators/restaurant');
const { NotFoundError } = require('../errors');
const checkPermission = require('../utils/checkPermission');
const {
  getPagination,
  getPagingData,
} = require('../helpers/generic-functions');
const { fullTextSearch } = require('../helpers/fulltext-search');

exports.getAllRestaurants = async (req, res) => {
  const { page, size } = req.query;
  const { Op } = Sequelize;
  const { limit, offset } = getPagination(page, size);

  /**  models specifies the model to search on */
  const models = `"Restaurant"."_search"`;
  const fullSearch = fullTextSearch(req, models);

  await sequelize.transaction(async (t) => {
    const users = await Restaurant.findAndCountAll({
      where: {
        [Op.and]: [...fullSearch],
      },
      order: [['id', 'DESC']],
      transaction: t,
      limit,
      offset,
    });

    const results = getPagingData(users, page, limit);
    res.status(200).json({
      statusCode: StatusCodes.OK,
      statusMessage: ReasonPhrases.OK,
      data: results,
    });
  });
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

exports.getRestaurant = async (req, res) => {
  const { id } = req.params;

  await sequelize.transaction(async (t) => {
    const restaurant = await Restaurant.findOne({
      where: { id },
      transaction: t,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
    });
    if (!restaurant) {
      throw new NotFoundError(`Restaurant ID -> ${id} does not exist`);
    }

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      statusMessage: ReasonPhrases.OK,
      data: restaurant,
    });
  });
};

exports.deleteRestaurant = async (req, res) => {
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
