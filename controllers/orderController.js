const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const { sequelize, Menu, Order, Deliverable, User } = require('../db/models');

const { handleJoiError } = require('../utils/server-response');
const { validateOrder, validateOrderStatus } = require('../validators/order');
const { NotFoundError, UnauthorizedError } = require('../errors');

const {
  getPagination,
  getPagingData,
} = require('../helpers/generic-functions');

exports.getAllOrder = async (req, res) => {
  const { page, size } = req.query;

  const { limit, offset } = getPagination(page, size);

  await sequelize.transaction(async (t) => {
    const users = await Order.findAndCountAll({
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'address', 'phone'],
        },
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

exports.createOrder = async (req, res) => {
  const { error } = validateOrder(req.body);
  if (error) {
    return handleJoiError(res, error);
  }

  const { items } = req.body;

  await sequelize.transaction(async (t) => {
    const order = await Order.create(
      { ownerId: req.user.id },
      { transaction: t }
    );

    const itemsWithOrderNo = items.map((item) => {
      return {
        ...item,
        orderId: order.id,
      };
    });

    await Deliverable.bulkCreate([...itemsWithOrderNo], { transaction: t });

    await res.status(StatusCodes.CREATED).json({
      statusCode: StatusCodes.CREATED,
      statusMessage: ReasonPhrases.CREATED,
      data: order,
    });
  });
};

exports.updateOrderStatus = async (req, res) => {
  const { error } = validateOrderStatus(req.body);
  if (error) {
    return handleJoiError(res, error);
  }
  const { id } = req.params;
  const order = await Order.findOne({ where: { id } });
  await sequelize.transaction(async (t) => {
    if (!order) {
      throw new NotFoundError(`Order ID -> ${id} does not exist`);
    }
    // only admins should update order
    if (req.user.role !== 'ADMIN') {
      throw new UnauthorizedError('Only admins can carry out this action');
    }
    const updatedMenu = await Order.update(
      { ...req.body },
      { where: { id }, returning: true, plain: true },
      { transaction: t }
    );
    const result = updatedMenu[1];

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      statusMessage: ReasonPhrases.OK,
      data: result,
    });
  });
};

exports.getOrder = async (req, res) => {
  const { id } = req.params;

  await sequelize.transaction(async (t) => {
    const order = await Order.findOne({
      where: { id },
      transaction: t,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'address', 'phone'],
        },
        {
          model: Deliverable,
          as: 'deliverables',
          attributes: ['id', 'quantity', 'orderId', 'menuId'],
          include: [
            {
              model: Menu,
              as: 'menu',
              attributes: ['id', 'itemName', 'price'],
            },
          ],
        },
      ],
    });
    if (!order) throw new NotFoundError(`Menu ID -> ${id} does not exist`);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      statusMessage: ReasonPhrases.OK,
      data: order,
    });
  });
};
