const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Name is required',
  },
  description: String,
  price: Number,
  image: String,
})

module.exports = mongoose.model('Item', itemSchema)
