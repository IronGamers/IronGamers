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

// FUNCIONES
function getGameDetails(gameName) {

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
  const response = IGDB
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
    // .limit(1)
    .request('/games')
    .then(res => {
      const data = res.data[0]

      // Unix timestamp to normal date
      let releaseDate = new Date(res.data[0].first_release_date * 1000)

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
      console.log(gameInfo)
    })
    .catch(error => console.log(error))

}

module.exports.genderList = (req, res, next) => {

  // Tiger Woods PGA Tour 14
  getGameDetails('wood')
  return


  // Datos que necesitamos
  /*
  
   == NECESARIAS (devuelve array de objetos) ==
  cover => la carátula del juego
  first_release_date => cuando salió el juego (unix time stamp, https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript)
  franchise => franquicia principal (franchise ID, luego coger name que es un string)
  genres => géneros del juego (genre ID, luego coger name que es un string)
  name => nombre del juego (String)
  platforms => (no se ven bien)plataformas para las que salió (platforms ID, luego coger name que es un string y platform_logo que es otro ID)
  screenshots => imágenes del juego (screenshot ID => coger url)
  summary => la descripción del juego (String)
  total_rating => rating sobre 100 (double)
  total_rating_count => cuántos han votado (integer)
  videos => videos del juego (game-video ID, luego coger video_ID, se busca en youtube: https://www.youtube.com/watch?v=video_ID)
  
  == BUSCAR POR UN CAMPO ==
  en fields pones el campo que quieras buscar y luego en search lo que estás buscando
  
  == OPCIONALES ==
  themes => themes del juego (theme ID)
  time_to_beat => cuanto se tarda en pasarse el juego (time-to-beat ID)
  dlcs => dlcs
  expansions => expansiones
  follows => cuánta gente lo sigue en IGDB
  websites => webs asociadas al game (website ID, luego coger URL (string))
  
  */
  const IGDB = apicalypse({
    baseURL: "https://api-v3.igdb.com",
    headers: {
      'Accept': 'application/json',
      'user-key': '2a79c904bd7921141480963f315e6afb'
    },
    responseType: 'json',
    timeout: 5000
  });

  // JOIN THINGS
  const response2 = IGDB
    .fields('genres.name')
    .limit(10)
    // .where(`screenshots != null`)
    .request('/games')
    .then(response => {
      console.log(response.data)
      // res.redirect('/')
    })
    .catch(error => next(error))
}

    // const response2 = IGDB

  //   .fields('name')
  //   .limit(5)
  //   // .where(`name != null`)
  //   // .search('diablo')
  //   .request('/games')
  //   .then(response => {
  //     console.log(response.data)
  //     // res.redirect('/')
  //   })
  //   .catch(error => next(error))