const mongoose = require('mongoose')
const Item = require('./Item')
const tool = require('../utils/schematool')

const options = {
  toJSON: { transform: tool.transform },
  collection: 'feedback', // Don't let mongoose pluralize the collection name
}

const schema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, 'Comment is required'],
  },
  rating: {
    type: Number,
    min: [0, "Rating can't be negative"],
    max: [5, "Rating can't be greater than 5"],
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    validate: { validator: tool.validator(Item) },
  },
}, options)

module.exports = mongoose.model('Feedback', schema)
