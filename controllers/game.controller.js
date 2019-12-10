const mongoose = require('mongoose');
const Game = require('../models/game-model')
const Gender = require('../models/gender-model')
const apicalypse = require('apicalypse').default


// FORMULARIO GAME
module.exports.newGame = (_, res, next) => {
  Gender.find()
    .then(genders => {
      res.render('game/gameForm', { genders })
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

//  EDIT GAME
module.exports.edit = (req, res, next) => {
  const gameID = req.params.gameID
  Game.findById(gameID)
    .then(game => {
      Gender.find()
        .then(genders => {
          res.render('game/gameForm', {
            game: game,
            genders: genders,
            edit: true
          })
        })
    })
    .catch(error => console.log("Error in finding games => ", error))
}

module.exports.doEdit = (req, res, next) => {
  const gameID = req.params.gameID
  Game.findByIdAndUpdate(gameID, req.body)
    .then(game => {
      res.redirect('/genders')
    })
    .catch(error => console.log("Error in editing game => ", error))
}


// call API

module.exports.genderList = (req, res, next) => {

  const IGDB = apicalypse({
    baseURL: "https://api-v3.igdb.com",
    headers: {
        'Accept': 'application/json',
        'user-key': '2a79c904bd7921141480963f315e6afb'
    },
    responseType: 'json',
    timeout: 5000
});

// const response1 = await IGDB
//         .limit(50)
//         .request('/games');

//         console.log(response1)

const response2 = IGDB
.fields('name, summary')
        .limit(1)
        .request('/games')
        .then(res => {
          console.log(res.data)
        })
        .catch( error => next(error))
 
}