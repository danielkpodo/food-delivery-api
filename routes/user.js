const { Router } = require('express');
const { register } = require('../controllers/userController');

const router = Router();

router.route('/').post(register);

module.exports = router;
