const express = require('express');
const router = express.Router();
const baseController = require('../controllers/base.controller')
const usersController = require('../controllers/users.controller')
const genderController = require('../controllers/gender.controller')
const gameController = require('../controllers/game.controller')
const chatRoomController = require('../controllers/chatRoom.controller')
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


// GENDER ROUTES
router.get('/genders', authMiddelware.isAuthenticated, genderController.listGenders)
router.get('/genders/new', authMiddelware.isAuthenticated, genderController.newGender)
router.post('/genders/new', authMiddelware.isAuthenticated, upload.single('image'), genderController.createGender)
router.get('/genders/:genderID', authMiddelware.isAuthenticated, genderController.listGames)
router.get('/genders/:genderID/edit', authMiddelware.isAuthenticated, genderController.edit)
router.post('/genders/:genderID/edit', authMiddelware.isAuthenticated, genderController.doEdit)


// GAMES ROUTES
router.get('/games/new', authMiddelware.isAuthenticated, gameController.newGame)
router.post('/games/new', authMiddelware.isAuthenticated, upload.single('image'), gameController.createGame)
router.get('/games/:gameID/edit', authMiddelware.isAuthenticated, gameController.edit)
router.post('/games/:gameID/edit', authMiddelware.isAuthenticated, gameController.doEdit)
router.get('/games/:gameID', authMiddelware.isAuthenticated, gameController.join)
router.post('/games/:gameID/like', authMiddelware.isAuthenticated, gameController.like)

// CHAT ROUTES
router.post('/games/:chatRoomID/:gameID/newMessage', authMiddelware.isAuthenticated, chatRoomController.sendMessage)


module.exports = router;