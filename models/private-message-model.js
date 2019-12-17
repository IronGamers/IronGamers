const mongoose = require('mongoose')
const Schema = mongoose.Schema

//  SE CREA EL MODELO
const privateMessageSchema = new Schema({
  myUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  destinationUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  msgState: {
    type: String,
    default: "pending"
  }

}, { timestamps: true })

//  SE EXPORTA EL MODELO
const PrivateMessage = mongoose.model('Message', privateMessageSchema)
module.exports = PrivateMessage