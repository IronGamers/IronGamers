const mongoose = require('mongoose');
const Game = require('../models/game-model')
const Gender = require('../models/gender-model')
const ChatRoom = require('../models/chatRoom-model')
const Like = require('../models/like-model')
const Chat = require('../models/chat-model')
const functions = require('../config/functions.api')


// FORMULARIO GAME
module.exports.newGame = (_, res, next) => {
  Gender.find()
    .then(genders => {
      res.render('game/gameForm', { genders, game: new Game() })
    })
    .catch(error => console.log("Error in finding genders => ", error))
}

// CREAR GAME
module.exports.createGame = (req, res, next) => {
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
      // SE CREA LA CHAT ROOM
      const newChatRoom = new ChatRoom({
        game: game.id,
        users: []
      })
      newChatRoom.save()
        .then(() => res.redirect('/genders'))
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

module.exports.join = (req, res, next) => {
  const gameID = req.params.gameID
  ChatRoom.findOne({ game: gameID })
    .populate('game')
    .then(chatRoom => {
      Chat.find({ room: chatRoom.id, user: req.currentUser._id })
        .populate('user')
        .then(chats => {
          // Se añade el usuario al array si no lo está ya
          if (!chatRoom.users.includes(req.currentUser.nickName)) {
            chatRoom.users.push(req.currentUser.nickName)
            ChatRoom.findByIdAndUpdate(chatRoom.id, { users: chatRoom.users }, { new: true })
              .then(chatRoom => {
                res.render('game/chatRoom', {
                  chatRoom: chatRoom,
                  chats: chats,
                  userCount: chatRoom.users.length
                })
              })
          } else {
            res.render('game/chatRoom', {
              chatRoom: chatRoom,
              chats: chats,
              userCount: chatRoom.users.length
            })
          }
        })
    })
    .catch(error => console.log("Error in joining room => ", error))
}

module.exports.like = (req, res, next) => {
  const gameID = req.params.gameID
  const userID = req.currentUser._id

  Like.findOneAndRemove({ gameID: gameID, userID: userID })
    .then(like => {
      if (like) {
        res.json({ likes: -1 })
      } else {
        const newLike = new Like({
          userID: userID,
          gameID: gameID
        })
        newLike.save()
          .then(() => {
            res.json({ likes: 1 })
          })
      }
    })
    .catch(error => console.log("Error giving like => ", error))
}


module.exports.gameDetail = (req, res, _) => {
  const gameName = req.params.gameName
  functions.getGameDetails(`${gameName}`, 0, 1)
  .then(game => {
    console.log(game)
    res.render('game/gameDetail', {game: game[0]})
  })
  .catch(error => console.log("Error in getting details of game => ", error))
}




module.exports.genderList = (req, res, next) => {
  const search = req.body.searchData
  const {init, items} = req.body
  console.log(req.body, 'req.body')

  functions.getGameDetails(search,0 ,items)
    .then(data => {
      console.log(data)
      res.render('game/detailGames', {games: data, items, search})
    })
}


module.exports.gameList = (req, res, next) => {
  res.render('game/detailGames')
}