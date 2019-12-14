const mongoose = require('mongoose');
const Game = require('../models/game-model')
const Gender = require('../models/gender-model')
const ChatRoom = require('../models/chatRoom-model')
const Like = require('../models/like-model')
const Chat = require('../models/chat-model')
const apicalypse = require('apicalypse').default


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
  getGameDetails(`${gameName}`, 0, 1)
  .then(game => {
    console.log(game)
    res.render('game/gameDetail', {game: game[0]})
  })
  .catch(error => console.log("Error in getting details of game => ", error))
}


module.exports.genderList = (req, res, next) => {

  // getGenres()
  //   .then(response => {
  //     console.log(response)
  //   })

  getGameDetails('Diablo III: Rise of the Necromancer',0, 15)
    .then(response => {
      console.log(response)
    })
    .catch(error => console.log("Error getting game details => ", error))

}

// ===== FUNCIONES ======
function getGameDetails(gameName, offset, limit) {

  const IGDB = apicalypse({
    baseURL: "https://api-v3.igdb.com",
    headers: {
      'Accept': 'application/json',
      'user-key': '2a79c904bd7921141480963f315e6afb'
    },
    responseType: 'json',
    timeout: 60000
  });

  // platforms.platform_logos.url
  return IGDB
    .fields(`name,cover.url,
          first_release_date,
          franchise.name,
          genres.name,
          platforms.name,
          platforms.platform_logo.url,
          screenshots.url,
          summary,
          total_rating,
          total_rating_count,
          videos.video_id`)
    .search(`${gameName}`)
    .offset(offset || 0)
    .limit(limit || 2)
    .request('/games')
    .then(res => {

      const result = res.data.map(data => {

        // Unix timestamp to normal date
        let releaseDate = new Date(data.first_release_date * 1000)

        // Distinto de Invalid Date y se pasa a dd-mm-yyyy
        if (!isNaN(releaseDate)) {
          releaseDate = releaseDate.getDate() + '/' + (releaseDate.getMonth() + 1) + '/' + releaseDate.getFullYear()
        } else {
          releaseDate = undefined
        }

        // Cover
        const cover = () => {
          if (data.cover) {
            return data.cover.url
          }
        }

        // Genres
        const genres = () => {
          if (data.genres) {
            return data.genres.map(genre => genre.name)
          }
        }

        // Platform names
        const platformNames = () => {
          if (data.platforms) {
            return data.platforms.map(platform => platform.name)
          }
        }

        // Platform logo
        const platformLogo = () => {
          if (data.platform && data.platform.platform_logo) {
            return data.platforms
              .map(platform => platform.platform_logo)
              .map(logo => logo.url)
          }
        }

        // Screenshots
        const screenshots = () => {
          if (data.screenshots) {
            return data.screenshots.map(screenshot => screenshot.url)
          }
        }

        // Videos
        const videos = () => {
          if (data.videos) {
            return data.videos.map(video => video.video_id)
          }
        }

        const gameInfo = {
          name: data.name,
          cover: cover(),
          first_release_date: releaseDate,
          genres: genres(),
          platforms_name: platformNames(),
          platforms_logo: platformLogo(),
          screenshots: screenshots(),
          summary: data.summary,
          total_rating: data.total_rating,
          total_rating_count: data.total_rating_count,
          videos: videos()
        }
        return gameInfo
      })

      return result
    })
    .catch(error => console.log(error))
}

function getGenres() {
  const IGDB = apicalypse({
    baseURL: "https://api-v3.igdb.com",
    headers: {
      'Accept': 'application/json',
      'user-key': '2a79c904bd7921141480963f315e6afb'
    },
    responseType: 'json',
    timeout: 60000
  });

  // platforms.platform_logos.url
  return IGDB
    .fields(`name`)
    .request('/genres')
    .then(res => {
      return res.data.map(data => data.name)
    })
    .catch(error => console.log(error))
}