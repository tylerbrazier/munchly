const mongoose = require('mongoose')
const tool = require('../utils/schematool')

const options = {
  toJSON: { transform: tool.transform }
}

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Name is required',
  },
  description: {
    type: String,
    required: 'Description is required',
  },
  price: {
    type: Number,
    required: 'Nothing is free',
  },
  image: String,
}, options)

module.exports = mongoose.model('Item', schema)
