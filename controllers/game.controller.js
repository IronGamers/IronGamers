const mongoose = require('mongoose');
const Game = require('../models/game-model')
const Gender = require('../models/gender-model')

// FORMULARIO GAME
module.exports.newGame = (_, res, next) => {
  Gender.find()
    .then(genders => {
      res.render('game/gameForm', {genders})
    })
    .catch(error => console.log("Error in finding genders => ", error))
}

// CREAR GAME
module.exports.createGame = (req, res, next) => {
  console.log("EHHHHH => ", req.body)
  const newGame = new Game({
    name: req.body.name,
    image: `/uploads/${req.file.filename}`,
    description: req.body.description,
    releaseDate: req.body.releaseDate,
    score: req.body.score,
    gender: req.body.gender
  })

  newGame.save()
    .then(game => {
      console.log('New game created => ', game.name)
      res.redirect('/genders')
    })
    .catch(error => console.log("Error in creating game => ", error))
}

// MOSTRAR DATOS DEL JUEGO
module.exports.gameDetail = (req, res, next) => {
  const gameID = req.params.gameID
  Game.findById(gameID)
    .then(game => {
      res.render('game/detail', { game })
    })
    .catch(error => console.log("Error in finding games => ", error))
}