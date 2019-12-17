const mongoose = require('mongoose')
const Schema = mongoose.Schema

//  SE CREA EL MODELO
const chatRoomSchema = new Schema({
  game: {
    type: String,
    unique: true,
    required: true
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }]
}, { timestamps: true })

//  SE EXPORTA EL MODELO
const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema)
module.exports = ChatRoom