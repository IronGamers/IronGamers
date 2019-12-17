const mongoose = require('mongoose')
const Schema = mongoose.Schema

//  SE CREA EL MODELO
const friendSchema = new Schema({
  user1: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  user2: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  state: {
    type: String,
    default: "pending"
  }

}, { timestamps: true })

//  SE EXPORTA EL MODELO
const Friend = mongoose.model('Friend', friendSchema)
module.exports = Friend