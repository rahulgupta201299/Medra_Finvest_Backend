const express = require('express');
const profileController = require('./Profile_controller');
const router = express.Router();

router.post('/signup', profileController.userSignUp);
router.post('/login', profileController.userLogin);

module.exports = router;