const Chat = require('../models/chat-model')
const Friend = require('../models/friend-model')
const PrivateMessage = require('../models/private-message-model')
const url = require('url')

module.exports.sendMessage = (req, res) => {
  const message = req.body.message
  const gameName = req.params.gameName
  const chatRoomID = req.params.chatRoomID

  if (message) {
    const newChat = new Chat({
      room: chatRoomID,
      user: req.currentUser._id,
      userMsg: message
    })

    newChat.save()
      .then(chat => {
        res.redirect(`/games/${gameName}/chat`)
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

  // Que no sean el mismo usuario
  if (myUser !== destinationUser) {
    // Habría que cambiar el state a "accepted"
    Friend.findOne({ user1: myUser, user2: destinationUser, state: "pending" })
      .populate('user1')
      .populate('user2')
      .then(friend => {
        if (friend) {
          res.render('game/privateMessage', { users: friend })
        } else {
          res.redirect('back')
        }
      })
      .catch(error => console.log("Error in privateMessage => ", error))
  }
}

module.exports.sendPrivateMessage = (req, res, next) => {
  const myUser = req.currentUser._id
  const destinationUser = req.params.userID

  const newMessage = new PrivateMessage({
    myUser: myUser,
    destinationUser: destinationUser,
    subject: req.body.subject,
    body: req.body.body,
    state: "pending"
  })

  newMessage.save()
    .then(message => {

       //Falta el redirect a la página anterior
      // return window.history.back

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