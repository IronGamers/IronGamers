const express = require('express');
const router = express.Router();
const baseController = require('../controllers/base.controller')
const usersController = require('../controllers/users.controller')
const genderController = require('../controllers/gender.controller')
const gameController = require('../controllers/game.controller')
const authMiddelware = require('../middlewares/auth.middleware')
const multer = require('multer');
const upload = multer({
    dest: './public/uploads/'
});

// USER ROUTES

router.get('/', authMiddelware.isAuthenticated, baseController.home)
router.get('/user/login', authMiddelware.isNotAuthenticated, usersController.login)
router.post('/login', authMiddelware.isNotAuthenticated, usersController.doLogin)
router.get('/user/new', authMiddelware.isNotAuthenticated, usersController.new)
router.post('/user/new', authMiddelware.isNotAuthenticated, usersController.create)
router.post('/user/logout', authMiddelware.isAuthenticated, usersController.logout)
router.get('/admin/users', authMiddelware.isAuthenticated, usersController.userList)
router.post('/admin/delete', authMiddelware.isAuthenticated, usersController.delete)


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



module.exports = router;