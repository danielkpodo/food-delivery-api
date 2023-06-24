const { Router } = require('express');

const {
  createMenu,
  deleteMenu,
  getAllMenu,
  updateMenu,
  getMenu,
} = require('../controllers/menuController');
const { authenticateUser } = require('../middlewares/authenticate-user');
const router = Router();

router
  .route('/')
  .get(authenticateUser, getAllMenu)
  .post(authenticateUser, createMenu);
router
  .route('/:id')
  .get(authenticateUser, getMenu)
  .delete(authenticateUser, deleteMenu)
  .patch(authenticateUser, updateMenu);

module.exports = router;
