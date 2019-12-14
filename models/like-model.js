const mongoose = require('mongoose')
const Schema = mongoose.Schema

//  SE CREA EL MODELO
const likeSchema = new Schema({
  gameID: {
    type: Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

}, { timestamps: true })

//  SE EXPORTA EL MODELO
const Like = mongoose.model('Like', likeSchema)
module.exports = Like