const mongoose = require('mongoose')
const tool = require('../utils/schematool')
const Item = require('./Item')

const options = {
  toJSON: { transform: tool.transform }
}

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Name is required',
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    validate: { validator: tool.validator(Item) }
  }],
}, options)

module.exports = mongoose.model('Category', schema)
