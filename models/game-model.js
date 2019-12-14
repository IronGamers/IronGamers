const mongoose = require('mongoose')
const Schema = mongoose.Schema
require('./like-model')

//  SE CREA EL MODELO
const gameSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Game name is required!'],
    unique: true,
    trim: true,
    minlength: [3, 'Game must have at least 3 chars!']
  },
  image: {
    type: String,
    required: [true, 'Game image is required!']
  },
  description: {
    type: String,
    required: [true, 'Gender description is required!']
  },
  releaseDate: {
    type: Date,
    required: [true, 'You must write game release date!']
  },
  score: {
    type: Number,
    required: [true, 'Game score is required!'],
    min: [0, 'Min score is 0!'],
    max: [10, 'Max score is 10!']
  },
  gender: [{ // Array de objetos, ya que puede tener varios géneros
    type: Schema.Types.ObjectId,
    required: [true, 'Game gender is required!']
  }]

}, { timestamps: true })

gameSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'gameID',
  justOne: false,
});

//  SE EXPORTA EL MODELO
const Game = mongoose.model('Game', gameSchema)
module.exports = Game