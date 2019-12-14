const mongoose = require('mongoose')
const Schema = mongoose.Schema

//  SE CREA EL MODELO
const chatSchema = new Schema({
  room: {
    type: Schema.Types.ObjectId,
    ref: "ChatRoom",
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref:"User",
    required: true
  },
  userMsg: {
    type: String,
    required: true
  }
}, { timestamps: true })

// chatSchema.virtual('chatRoom', {
//   ref: 'ChatRoom',
//   localField: 'room',
//   foreignField: '_id',
//   justOne: false,
// });  

chatSchema.virtual('userDetail', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: false,
});

//  SE EXPORTA EL MODELO
const Chat = mongoose.model('Chat', chatSchema)
module.exports = Chat