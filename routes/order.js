const { Router } = require('express');

const {
  createOrder,
  getAllOrder,
  getOrder,
  updateOrderStatus,
} = require('../controllers/orderController');
const { authenticateUser } = require('../middlewares/authenticate-user');
const router = Router();

router
  .route('/')
  .get(authenticateUser, getAllOrder)
  .post(authenticateUser, createOrder);

router
  .route('/:id')
  .get(authenticateUser, getOrder)
  .patch(authenticateUser, updateOrderStatus);

module.exports = router;
