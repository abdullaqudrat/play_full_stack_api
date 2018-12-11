// define database
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../config/knexfile')[environment];
const database = require('knex')(configuration);

const all = () => database('favorites')
  .select()

const find = (id) => database('favorites')
  .where('id', id)
  .select()

const create = (returnValue, array) => database('favorites')
  .insert(returnValue, array)

const update = (id, returnValue, array) => database('favorites').where({ id: id }).update(returnValue, array)

module.exports = {
  all,
  find,
  create,
  update,
}
