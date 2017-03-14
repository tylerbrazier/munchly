#!/usr/bin/env node
'use strict';

const util = require('util');
const dbtool = require('./dbtool')( {preDrop: true} );

dbtool.open((err) => {
  if (err)
    return finish(err);
  const Menu = require('../models/Menu');
  const Category = require('../models/Category');
  const Item = require('../models/Item');

  const menuData = require('./data/menu.json');
  const categoryData = require('./data/categories.json');
  const categories = [];

  Item.create(require('./data/breakfast/items.json'))
    .then( (items) => Category.create(Object.assign(categoryData[0],{items})) )
    .then( (breakfast) => categories.push(breakfast._id) )

    .then( () => Item.create(require('./data/lunch/items.json')) )
    .then( (items) => Category.create(Object.assign(categoryData[1],{items})) )
    .then( (lunch) => categories.push(lunch._id))

    .then( () => Category.create(categoryData[2]) )
    .then( (snacks) => categories.push(snacks._id) )

    .then( () => Menu.create(Object.assign(menuData, {categories})) )

    .then( () => {
      return Menu.findOne()
        .populate({path:'categories', populate:{path:'items'}})
        .exec();
    })

    .then( (result) => util.inspect(result, {depth:null, colors:true}))

    .then(finish)
    .catch(finish);
});

function finish(err) {
  if (err)
    console.error(err);
  dbtool.close((err) => { if (err) console.error(err); });
}
