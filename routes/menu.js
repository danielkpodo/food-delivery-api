const { Router } = require('express');

const {
  createMenu,
  deleteMenu,
  getAllMenu,
  updateMenu,
} = require('../controllers/menuController');
const { authenticateUser } = require('../middlewares/authenticate-user');
const router = Router();

router.route('/').get(getAllMenu).post(authenticateUser, createMenu);
router
  .route('/:id')
  // .get(authenticateUser, updateRestaurant)
  .delete(authenticateUser, deleteMenu)
  .patch(authenticateUser, updateMenu);

module.exports = router;
