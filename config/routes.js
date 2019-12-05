const express = require('express');
const router = express.Router();
const genderController = require('../controllers/gender.controller')
const gameController = require('../controllers/game.controller')
const multer = require('multer');
const upload = multer({ dest: './public/uploads/' });

module.exports = router;

// GENDER ROUTES (PENDIENTE PONER MIDDLEWARE)
router.get('/genders', genderController.listGenders)
router.get('/genders/new', genderController.newGender)
router.post('/genders/new', upload.single('image'), genderController.createGender)
router.get('/genders/:genderID', genderController.listGames)


// GAMES ROUTES (PENDIENTE PONER MIDDLEWARE)
router.get('/games/new', gameController.newGame)
router.post('/games/new', upload.single('image'), gameController.createGame)
router.get('/games/:gameID', gameController.gameDetail)