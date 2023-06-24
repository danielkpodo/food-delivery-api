const { Router } = require('express');

const {
  getAllRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurant,
} = require('../controllers/restaurantController');
const { authenticateUser } = require('../middlewares/authenticate-user');
const router = Router();

router
  .route('/')
  .get(getAllRestaurants)
  .post(authenticateUser, createRestaurant);
router
  .route('/:id')
  .get(authenticateUser, getRestaurant)
  .delete(authenticateUser, deleteRestaurant)
  .patch(authenticateUser, updateRestaurant);

module.exports = router;
