const Chat = require('../models/chat-model')
const Friend = require('../models/friend-model')
const PrivateMessage = require('../models/private-message-model')
const url = require('url')

module.exports.sendMessage = (req, res) => {
  const message = req.body.message
  const gameID = req.params.gameID
  const chatRoomID = req.params.chatRoomID

  if (message) {
    const newChat = new Chat({
      room: chatRoomID,
      user: req.currentUser._id,
      userMsg: message
    })

    newChat.save()
      .then(chat => {
        res.redirect(`/games/${gameID}/chat`)
      })
      .catch(error => console.log("Error saving new chat => ", error))
  }
}

module.exports.friendInvitation = (req, res) => {

  const myUser = req.currentUser._id
  const newFriend = req.params.userID

  // Que no sean el mismo usuario
  if (myUser !== newFriend) {

    Friend.findOne({ user1: myUser, user2: newFriend })
      .then(friend => {
        if (!friend) {
          const newFriendShip = new Friend({
            user1: myUser,
            user2: newFriend,
            state: "pending"
          })

          newFriendShip.save()
            .then(friendShip => {
              // Se hace por axios
              console.log('Invitation sent')
              res.json({})
            })
        }
      })
      .catch(error => console.log("Error sending invitation => ", error))
  }
}

module.exports.privateMessage = (req, res, next) => {

  // SOLO SE PUEDEN ENVIAR MENSAJES SI SON AMIGOS
  const myUser = req.currentUser._id
  const destinationUser = req.params.userID
  // const gameName = req.params.gameName
  const gameID = req.params.gameID

  // Que no sean el mismo usuario
  if (myUser !== destinationUser) {
    Friend.findOne({ $or: [{ user1: myUser, user2: destinationUser }, { user1: destinationUser, user2: myUser }], state: "accepted" })
      .populate('user1')
      .populate('user2')
      .then(friend => {
        if (friend) {

          // HAY QUE VER CUÁL ES CUÁL
          if (friend.user1.id.toString() === myUser.toString()) {
            res.render('game/privateMessage', {
              myUser: friend.user1,
              destinationUser: friend.user2,
              gameID: gameID
            })
          } else {
            res.render('game/privateMessage', {
              myUser: friend.user2,
              destinationUser: friend.user1,
              gameID: gameID
            })
          }
        }
        // else {
        //   res.redirect('back')
        // }
      })
      .catch(error => console.log("Error in privateMessage => ", error))
  }
}

module.exports.sendPrivateMessage = (req, res, next) => {
  const myUser = req.currentUser._id
  const destinationUser = req.params.userID
  // const gameName = req.params.gameName
  const gameID = req.params.gameID

  const newMessage = new PrivateMessage({
    myUser: myUser,
    destinationUser: destinationUser,
    subject: req.body.subject,
    body: req.body.body,
    state: "pending"
  })

  newMessage.save()
    .then(message => {
      res.redirect(`/games/${gameID}/chat`)
    })
    .catch(error => console.log("Error sending message => ", error))
}

/*
 COSAS PENDIENTES O QUE MOSTRAR

 1- CUANDO SE ENVÍA UNA INVITACIÓN A ALGUIEN, SE HACE POR AXIOS PERO NO RESPONDE...(había que poner un res.json vacío..)
 2- CUANDO SE ENVÍA UN MENSAJE PRIVADO, HAY QUE REDIRGIRLO A LA PÁGINA DEL JUEGO, ¿CÓMO HACERLO?/ Si no son amigos
    se quedan en pending...
 3- VER Y RESPONDER MENSAJES PRIVADOS
 4- VER PERFILES DE USUARIOS ¿?
 5- HABRÍA QUE LIMITAR LOS MENSAJES DEL CHAT (QUIZÁS HACER UNA PAGINACIÓN O COGER SOLO LOS ÚLTIMOS 50)

 EXTRA
 1- TOOLTIPS
 2- BUSCADOR 'FLEXIBLE'

*/