const mongoose = require('mongoose');
const tool = require('../utils/schematool');
const Category = require('./Category');
const logger = require('../utils/logger');

const options = {
  toJSON: { transform: tool.transform },
  collection: 'menu', // Don't let mongoose pluralize the collection name
};

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
}, options);

const Menu = mongoose.model('Menu', schema);

// when a category is deleted, remove it from all menus containing it
// (even though there should be only one menu)
Category.schema.post('remove', (cat) => {
  logger.debug('Starting post-remove hook in Menu for category %j', cat, {});
  Menu.find({ categories: cat._id }, (err, menus) => {
    if (err)
      return logger.error(err);

    if (!menus || menus.length == 0)
      return logger.debug('Category not found on the menu');

    menus.forEach(m => removeCategoryFromMenu(cat, m));
  });
});

function removeCategoryFromMenu(cat, menu) {
  var index = menu.categories.indexOf(cat._id);
  if (index < 0)
    return logger.error(`No index of ${cat._id} in ${menu.categories}`);

  menu.categories.splice(index, 1); // cut it out
  menu.save((err, menu, nUpdated) => {
    if (err)
      return logger.error(err);

    logger.debug('Updated menu %j', menu, {});
  });
}

module.exports = Menu;
