// define database
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../../config/knexfile')[environment];
const database = require('knex')(configuration);

const index = (request, response) => {
  database('favorites').select()
    .then((favorites) => {
      response.status(200).json(favorites)
    })
    .catch((error) => {
      response.status(500).json({ error })
    })
}

module.exports = {
  index,
}
