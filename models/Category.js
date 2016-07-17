const mongoose = require('mongoose')
const tool = require('../utils/schematool')
const Item = require('./Item')
const logger = require('../utils/logger')

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

const Category = mongoose.model('Category', schema)

// when an item is deleted, remove it from all categories containing it
Item.schema.post('remove', (item) => {
  logger.debug('Starting post-remove hook in Category for item %j', item, {})
  Category.find({ items: item._id }, (err, categories) => {
    if (err)
      return logger.error(err)

    let count = categories ? categories.length : 0
    logger.debug(`Found ${count} categories containing the item`)

    if (categories)
      categories.forEach(c => removeItemFromCategory(item, c))
  })
})

function removeItemFromCategory(item, c) {
  var index = c.items.indexOf(item._id)
  if (index < 0)
    return logger.error(`No index of ${item._id} in category.items: ${c.items}`)

  c.items.splice(index, 1) // cut it out
  c.save((err, category, nUpdated) => {
    if (err)
      return logger.error(err)

    logger.debug('Updated Category %j', category, {})
  })
}

module.exports = Category
