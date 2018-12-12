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
    .then(favorite => {
      if (favorite.length) {
        response.status(200).json({ id: favorite[0]["id"], song_title: favorite[0]["song_title"], artist_name: favorite[0]["artist_name"], genre: favorite[0]["genre"], song_rating: favorite[0]["song_rating"] });
      } else {
        response.status(404).json({
          error: `Could not find favorite with id ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
}

const create = (request, response) => {
  const favorite = request.body;

  for (let requiredParameter of ['song_title', 'artist_name', 'genre', 'song_rating']) {
    if (!favorite[requiredParameter]) {
      return response
      .status(400)
      .send({ error: `Expected format: { song_title: <String>, artist_name: <String>, genre: <String>, song_rating: <Integer> }. You're missing a "${requiredParameter}" property.` });
    } 
  }
  Favorite.create(favorite, ['id', 'song_title', 'artist_name', 'genre', 'song_rating'])
    .then(favorite => {
      if (favorite.length) {
        let favorites = { favorites: { id: favorite[0]["id"], song_title: favorite[0]["song_title"], artist_name: favorite[0]["artist_name"], genre: favorite[0]["genre"], song_rating: favorite[0]["song_rating"] }}
      response.status(201).json(favorites)
      } else {
        response.status(400).json();
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
  }

  const update = (request, response) => {
    const favorite = request.body;

  for (let requiredParameter of ['song_title', 'artist_name', 'genre', 'song_rating']) {
    if (!favorite[requiredParameter]) {
      return response
        .status(400)
        .send({ error: `Expected format: { song_title: <String>, artist_name: <String>, genre: <String>, song_rating: <Integer> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  Favorite.update(request.params.id, favorite, ['id', 'song_title', 'artist_name', 'genre', 'song_rating'])
  .then(favorite => {
      if (favorite.length) {
        let favorites = { favorites: { id: favorite[0]["id"], song_title: favorite[0]["song_title"], artist_name: favorite[0]["artist_name"], genre: favorite[0]["genre"], song_rating: favorite[0]["song_rating"] }}
      response.status(200).json(favorites)
      } else {
        response.status(400).json();
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
  }

  const destroy = (request, response) => {
  Favorite.find(request.params.id).del()
    .then(favorite => {
      response.status(204).json()
    })
    .catch(error => {
      response.status(404).json({ error });
    });
  }

module.exports = {
  index,
  show,
  create,
  update,
  destroy,
}
