const express = require('express');
const router = express.Router();
const baseController = require('../controllers/base.controller')
const usersController = require('../controllers/users.controller')
const genderController = require('../controllers/gender.controller')
const gameController = require('../controllers/game.controller')
const multer = require('multer');
const upload = multer({ dest: './public/uploads/' });

// USER ROUTES

router.get('/', baseController.home)
router.get('/user/login', usersController.login)
router.post('/login', usersController.doLogin)
router.get('/user/new', usersController.new)
router.post('/user/new', usersController.create)
router.post('/user/logout', usersController.logout)


// GENDER ROUTES (PENDIENTE PONER MIDDLEWARE)
router.get('/genders', genderController.listGenders)
router.get('/genders/new', genderController.newGender)
router.post('/genders/new', upload.single('image'), genderController.createGender)
router.get('/genders/:genderID', genderController.listGames)


// GAMES ROUTES (PENDIENTE PONER MIDDLEWARE)
router.get('/games/new', gameController.newGame)
router.post('/games/new', upload.single('image'), gameController.createGame)
router.get('/games/:gameID', gameController.gameDetail)



module.exports = router;
