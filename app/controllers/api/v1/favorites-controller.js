// // define database
// const environment = process.env.NODE_ENV || 'development';
// const configuration = require('../../../../config/knexfile')[environment];
// const database = require('knex')(configuration);

const Favorite = require('../../../models/favorite')

const index = (request, response) => {
  Favorite.all()
    .then((favorites) => {
      response.status(200).json(favorites)
    })
    .catch((error) => {
      response.status(500).json({ error })
    })
}

const show = (request, response) => {
  Favorite.find(request.params.id)
    .then(favorites => {
      if (favorites.length) {
        response.status(200).json({ id: favorites[0], song_title: favorites[1], artist_name: favorites[2], genre: favorites[3], song_rating: favorites[4]});
      } else {
        response.status(404).json({
          error: `Could not find song with id ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
}

module.exports = {
  index,
  show,
}
