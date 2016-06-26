const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Name is required',
  },
  description: {
    type: String,
    required: 'Description is required',
  },
  price: Number,
  image: String,
})

schema.set('toJSON', { transform: require('./util/transform') })

const Item = mongoose.model('Item', schema)
module.exports = Item
