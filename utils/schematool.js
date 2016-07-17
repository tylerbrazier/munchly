const logger = require('./logger')

// A transform function to be used for the toJSON option for a schema;
// It modifies the properties of a model for serialization into json -
// converting _id to id and removing __v.
// More info at http://mongoosejs.com/docs/api.html#document_Document-toObject
exports.transform = function(doc, ret, options) {
  ret.id = ret._id
  delete ret._id
  delete ret.__v
}

// Call with a model to return a validator function to be used for a schema
// property with type ObjectId. The validator ensures that an id assigned to
// this property exists and belongs to a document of the given model param.
// More info at http://mongoosejs.com/docs/validation.html
exports.validator = function(model) {
  return function(value, callback) {
    model.findOne({_id: value}, (err, thing) => {
      if (err) {
        logger.error(err)
        return callback(false, `Error looking up ${model.modelName} ${value}`)
      } else if (!thing) {
        return callback(false, `${model.modelName} ${value} doesn't exist`)
      } else {
        return callback(true)
      }
    })
  }
}
