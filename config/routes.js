const express = require('express');
const router = express.Router();
const genderController = require('../controllers/gender.controller')
const gameController = require('../controllers/game.controller')
const multer = require('multer');
const upload = multer({ dest: './public/uploads/' });
const baseController = require('../controllers/base.controller')
const usersController = require('../controllers/users.controller')

// GENDER ROUTES (PENDIENTE PONER MIDDLEWARE)
router.get('/genders', genderController.listGenders)
router.get('/genders/new', genderController.newGender)
router.post('/genders/new', upload.single('image'), genderController.createGender)
router.get('/genders/:genderID', genderController.listGames)
router.get('/genders/:genderID/edit', genderController.edit)
router.post('/genders/:genderID/edit', genderController.doEdit)


// GAMES ROUTES (PENDIENTE PONER MIDDLEWARE)
router.get('/games/new', gameController.newGame)
router.post('/games/new', upload.single('image'), gameController.createGame)
router.get('/games/:gameID/edit', gameController.edit)
router.post('/games/:gameID/edit', gameController.doEdit)

router.get('/', baseController.home)
router.get('/user/login', usersController.login)

module.exports = router;
