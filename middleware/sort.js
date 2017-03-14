// Call this function with a model and defaultField parameters to return
// a middleware function that:
//
// - allows 'sort' and 'order' query params to be used on this route;
//   e.g. /api/items?sort=name&order=desc
//
// - validates that the value of 'sort' is an included field on this route
//
// - validates that 'order' is either 'asc' or 'desc'
//
// - adds a 'sort' field to the req object that can be passed to a mongoose
//   query sort function used in api endpoints;
//   e.g. Item.find(...).sort(req.sort).exec(...)
//
// defaultField is used when no ?sort query param is given.
// defaultOrder is asc

const defaultOrder = 'asc';

// model and defaultField are required
module.exports = function(model, defaultField) {

  var allowedFields = getFields(model);

  // sanity check
  if (!isIncluded(defaultField, allowedFields))
    throw mkError(defaultField, allowedFields);

  return function(req, res, next) {
    var field = req.query.sort || defaultField;
    var order = req.query.order || defaultOrder;

    // validate sort field
    if (!isIncluded(field, allowedFields)) {
      res.statusCode = 400;
      return next(mkError(field, allowedFields));
    }

    // validate order
    if (order !== 'asc' && order !== 'desc') {
      res.statusCode = 400;
      return next(new Error("order must be either 'asc' or 'desc'"));
    }

    req.sort = (order == 'desc' ? '-' : '') + (field == 'id' ? '_id' : field);
    next();
  };

};

function getFields(model) {
  var result = ['id'];
  model.schema.eachPath(p => {
    if (p != '_id' && p != '__v')
      result.push(p);
  });
  return result;
}

// use this instead of indexOf because we have to handle the id to _id problem
function isIncluded(field, allowedFields) {
  if (field === 'id')
    return true;
  else
    return (allowedFields.indexOf(field) >= 0);
}

function mkError(field, allowedFields) {
  return new Error(`Sort error: '${field}' is not one of [${allowedFields}]`);
}
