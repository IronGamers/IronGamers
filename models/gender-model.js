const mongoose = require('mongoose')
const Schema = mongoose.Schema

//  SE CREA EL MODELO
const genderSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Gender name is required!'],
    unique: true,
    trim: true,
    minlength: [3, 'Gender must have at least 3 chars!']
  },  
  image: {
    type: String, 
    required: [true, 'Gender image is required!']
  },
  description: {
    type: String,
    required: [true, 'Gender description is required!']
  }

}, {timestamps: true})

//  SE EXPORTA EL MODELO
const Gender = mongoose.model('Gender', genderSchema)
module.exports = Gender