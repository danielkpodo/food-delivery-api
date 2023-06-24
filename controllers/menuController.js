const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const { sequelize, Sequelize, Restaurant, Menu } = require('../db/models');

const { handleJoiError } = require('../utils/server-response');
const { validateMenu } = require('../validators/menu');
const { NotFoundError } = require('../errors');
const checkPermission = require('../utils/checkPermission');
const {
  getPagination,
  getPagingData,
} = require('../helpers/generic-functions');
const { fullTextSearch } = require('../helpers/fulltext-search');

exports.getAllMenu = async (req, res) => {
  const { page, size, restaurantId } = req.query;
  const { Op } = Sequelize;
  const { limit, offset } = getPagination(page, size);

  const filterRestaurant = restaurantId
    ? { restaurantId: { [Op.eq]: restaurantId } }
    : null;

  /**  models specifies the model to search on */
  const models = `"Menu"."_search", "restaurant"."_search"`;
  const fullSearch = fullTextSearch(req, models);

  await sequelize.transaction(async (t) => {
    const users = await Menu.findAndCountAll({
      where: {
        [Op.and]: [...fullSearch],
        ...filterRestaurant,
      },
      include: [
        { model: Restaurant, as: 'restaurant', attributes: ['id', 'name'] },
      ],
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

exports.createMenu = async (req, res) => {
  const { error } = validateMenu(req.body);
  if (error) {
    return handleJoiError(res, error);
  }

  await sequelize.transaction(async (t) => {
    const restaurant = await Menu.create(
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

exports.updateMenu = async (req, res) => {
  const { error } = validateMenu(req.body);
  if (error) {
    return handleJoiError(res, error);
  }
  const { id } = req.params;
  const menu = await Menu.findOne({ where: { id } });
  await sequelize.transaction(async (t) => {
    if (!menu) {
      throw new NotFoundError(`Menu ID -> ${id} does not exist`);
    }
    checkPermission(req.user, menu);
    const updatedMenu = await Menu.update(
      { ...req.body },
      { where: { id }, returning: true, plain: true },
      { transaction: t }
    );
    const result = updatedMenu[1];

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      statusMessage: ReasonPhrases.OK,
      data: { ...result.toJSON() },
    });
  });
};

exports.getMenu = async (req, res) => {
  const { id } = req.params;

  await sequelize.transaction(async (t) => {
    const menu = await Menu.findOne({
      where: { id },
      transaction: t,
      include: [
        { model: Restaurant, as: 'restaurant', attributes: ['id', 'name'] },
      ],
    });
    if (!menu) throw new NotFoundError(`Menu ID -> ${id} does not exist`);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      statusMessage: ReasonPhrases.OK,
      data: menu,
    });
  });
};

exports.deleteMenu = async (req, res) => {
  const { id } = req.params;
  const menu = await Menu.findOne({ where: { id } });
  await sequelize.transaction(async (t) => {
    if (!menu) {
      throw new NotFoundError(`Menu ID -> ${id} does not exist`);
    }

    checkPermission(req.user, menu);
    await Menu.destroy({ where: { id } }, { transaction: t });

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      statusMessage: ReasonPhrases.OK,
      message: `Menu ID -> ${id} deleted successfully`,
    });
  });
};
