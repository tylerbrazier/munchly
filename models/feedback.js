const mongoose = require('mongoose')
const Item = require('./item')

const schema = new mongoose.Schema({
  body: {
    type: String,
    required: [true, 'Body is required'],
  },
  rating: {
    type: Number,
    min: [1, "Rating can't be less than 1"],
    max: [5, "Rating can't be greater than 5"],
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    validate: {
      validator: (value, respond) => {
        Item.findOne({_id: value}, (err, item) => {
          if (err) {
            console.error(err)
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
