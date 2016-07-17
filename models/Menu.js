const mongoose = require('mongoose')
const tool = require('../utils/schematool')
const Category = require('./Category')

const options = {
  toJSON: { transform: tool.transform },
  collection: 'menu', // Don't let mongoose pluralize the collection name
}

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Name is required',
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    validate: { validator: tool.validator(Category) },
  }],
}, options)

module.exports = mongoose.model('Menu', schema)
