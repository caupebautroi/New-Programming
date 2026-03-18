const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.put('/:id', userController.updateProfile);
router.put('/:id/password', userController.changePassword);

module.exports = router;