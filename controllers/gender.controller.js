const mongoose = require('mongoose');
const Gender = require('../models/gender-model')
const Game = require('../models/game-model')

// LISTAR GÉNEROS
module.exports.listGenders = (_, res, next) => {
  Gender.find()
    .then(genders => {
      res.render('gender/list', { genders })
    })
    .catch(error => console.log("Error in finding genders => ", error))
}

// FORMULARIO GÉNERO
module.exports.newGender = (_, res, next) => {
  res.render('gender/genderForm')
}

// CREAR GÉNERO
module.exports.createGender = (req, res, next) => {
  const newGender = new Gender({
    name: req.body.name,
    image: `/uploads/${req.file.filename}`,
    description: req.body.description
  })

  newGender.save()
    .then(gender => {
      console.log('New gender created => ' , gender.name)
      res.redirect('/genders')
    })
    .catch(error => console.log("Error in creating gender => ", error))
}

// MOSTRAR JUEGOS DEL GÉNERO
module.exports.listGames = (req, res, next) => {
  const genderID = req.params.genderID
  Game.find({gender: genderID})
    .then(games => {
      res.render('game/list', {games})
    })
    .catch(error => console.log("Error in finding games => ", error))
}

// EDIT
module.exports.edit = (req, res, next) => {
  const genderID = req.params.genderID
  Gender.findById(genderID)
    .then(gender => {
      res.render('gender/genderForm', {
        gender: gender,
        edit: true
      })
    })
    .catch(error => console.log("Error in finding gender => ", error))
}

module.exports.doEdit = (req, res, next) => {
  const genderID = req.params.genderID
  Gender.findByIdAndUpdate(genderID, req.body)
    .then(gender => {
      res.redirect('/genders')
    })
    .catch(error => console.log("Error in editing gender => ", error))
}