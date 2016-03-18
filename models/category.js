const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Name is required',
  },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
})

module.exports = mongoose.model('Category', categorySchema)
