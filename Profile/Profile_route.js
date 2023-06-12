const express = require('express');
const profileController = require('./Profile_controller');
const router = express.Router();

router.post('/signup', profileController.userSignUp);
router.post('/login', profileController.userLogin);
router.get('/:mobile', profileController.findMobileNumber);
router.post('/send-otp', profileController.sendOtp);
router.post('/verify-otp', profileController.verifyOtp);

module.exports = router;