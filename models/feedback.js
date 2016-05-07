const mongoose = require('mongoose')
const Item = require('./item')
const logger = require('../utils/logger')

const schema = new mongoose.Schema({
  body: {
    type: String,
    required: [true, 'Body is required'],
  },
  rating: {
    type: Number,
    min: [0, "Rating can't be negative"],
    max: [5, "Rating can't be greater than 5"],
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    validate: {
      validator: (value, respond) => {
        Item.findOne({_id: value}, (err, item) => {
          if (err) {
            logger.error(err)
            return respond(false, `Error looking up item ${value}`)
          } else if (!item)
            return respond(false, `Item ${value} doesn't exist`)
          else
            return respond(true)
        })
      },
    },
  },
}, {
  collection: 'feedback', // don't let mongoose pluralize the collection name
})

schema.set('toJSON', { transform: require('./util/transform') })

const Feedback = mongoose.model('Feedback', schema)
module.exports = Feedback
