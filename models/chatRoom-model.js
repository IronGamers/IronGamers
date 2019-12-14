const mongoose = require('mongoose')
const Schema = mongoose.Schema

//  SE CREA EL MODELO
const chatRoomSchema = new Schema({
  game: {
    type: Schema.Types.ObjectId,
    ref: "Game",
    unique: true,
  },
  users: {
    type: [String],
  }
 
}, { timestamps: true })

chatRoomSchema.virtual('gameDetail', {
  ref: 'Game',
  localField: 'game',
  foreignField: '_id',
  justOne: false,
});

//  SE EXPORTA EL MODELO
const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema)
module.exports = ChatRoom