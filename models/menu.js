const mongoose = require('mongoose')
const Category = require('./category') // needed for population to work

const options = {
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
