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
        response.status(200).json({ id: favorite[0]["id"], song_title: favorite[0]["song_title"], artist_name: favorite[0]["artist_name"], genre: favorite[0]["genre"], song_rating: favorite[0]["song_rating"]});
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

const create = (request, response) => {
  const song = request.body;

  for (let requiredParameter of ['song_title', 'artist_name', 'genre', 'song_rating']) {
    if (!song[requiredParameter]) {
      return response
      .status(422)
      .send({ error: `Expected format: { song_title: <String>, artist_name: <String>, genre: <String>, song_rating: <Integer> }. You're missing a "${requiredParameter}" property.` });
    }
  }
  Favorite.create(song, ['id', 'song_title', 'artist_name', 'song_rating'])
    .then(song => {
      response.status(201).json({ id: song[0], song_title: song[1], artist_name: song[2], genre: song[3], song_rating: song[4]})
    })
    .catch(error => {
      response.status(500).json({ error });
    });
  }

  const update = (request, response) => {
    const song = request.body;

  for (let requiredParameter of ['song_title', 'artist_name', 'genre', 'song_rating']) {
    if (!song[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { song_title: <String>, artist_name: <String>, genre: <String>, song_rating: <Integer> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  Favorite.update(request.params.id, song, ['id', 'song_title', 'artist_name', 'song_rating'])
    .then(song => {
      response.status(200).json({ id: song[0], song_title: song[1], artist_name: song[2], genre: song[3], song_rating: song[4]})
    })
    .catch(error => {
      response.status(500).json({ error });
    });
  }

  const destroy = (request, response) => {
  Favorite.find(request.params.id).del()
    .then(song => {
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
