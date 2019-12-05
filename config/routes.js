const express = require('express');
const router = express.Router();
const baseController = require('../controllers/base.controller')
const usersController = require('../controllers/users.controller')

module.exports = router;

router.get('/', baseController.home )
router.get('/user/login', usersController.login)
