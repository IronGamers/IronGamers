const Chat = require('../models/chat-model')

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
        
        res.redirect(`/games/${gameID}`)
      })
      .catch(error => console.log("Error saving new chat => ", error))

  } 
}