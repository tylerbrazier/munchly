#!/usr/bin/env node
'use strict'

const dbtool = require('./dbtool')( {preDrop: true} )
const categories = require('./data/categories.json')

dbtool.open((err) => {
  if (err)
    return finish(err)
  const Category = require('../models/category')
  const Item = require('../models/item')

  Item.create(require('./data/breakfast/items.json'))
    .then( (items) => Category.create(Object.assign(categories[0],{items})) )
    .then( (breakfast) => console.log('Breakfast:', breakfast) )

    .then( () => Item.create(require('./data/lunch/items.json')) )
    .then( (items) => Category.create(Object.assign(categories[1],{items})) )
    .then( (lunch) => console.log('Lunch:', lunch) )

    .then( () => Category.create(categories[2]) )
    .then( (snacks) => console.log('Snacks:', snacks) )

    .then(finish)
    .catch(finish)
})

function finish(err) {
  if (err)
    console.error(err)
  dbtool.close((err) => { if (err) console.error(err) })
}
