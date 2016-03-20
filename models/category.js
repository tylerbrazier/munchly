const mongoose = require('mongoose')
const Item = require('./item') // needed for population to work

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Name is required',
  },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
})

schema.set('toJSON', { transform: require('./util/transform') })

const Category = mongoose.model('Category', schema)
module.exports = Category
