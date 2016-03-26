const mongoose = require('mongoose')
const Category = require('./category') // needed for population to work

const options = {
  // Only allow one document in this collection.
  // Adding more will overwrite the existing.
  // size is required; 4096 is the minimum
  // https://docs.mongodb.org/manual/core/capped-collections/
  capped: { size: 4096, max: 1 },

  // Don't let mongoose pluralize the collection name
  collection: 'menu',
}

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Name is required',
  },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
}, options)

schema.set('toJSON', { transform: require('./util/transform') })

const Menu = mongoose.model('Menu', schema)
module.exports = Menu
