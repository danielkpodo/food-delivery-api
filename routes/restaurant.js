const { Router } = require('express');
const { getAllRestaurants } = require('../controllers/restaurantController');
const router = Router();

router.route('/').get(getAllRestaurants);

module.exports = router;
