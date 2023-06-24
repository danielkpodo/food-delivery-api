const { Router } = require('express');
const { register, signIn, signOut } = require('../controllers/userController');

const router = Router();

router.route('/').post(register);
router.route('/login').post(signIn);
router.route('/logout').get(signOut);

module.exports = router;
