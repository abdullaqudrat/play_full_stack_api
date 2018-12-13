# Play Full Stack API
Module 4 | Contributors: Abdulla Quadrat & Autumn Martin

Core Collaborators: Daniel Mulitouopele, Amy Holt, & Cory Westerfield

## About
### Intro
Play is a personal playlist builder for music lovers to create playlists for only the best songs: personal favorites.

Check it out live [here](https://github.com/abdullaqudrat/play_full_stack/).

### Background
Play is a single page JavaScript application designed for mobile displays. You are looking at its backend component, an Express API which retrieves song data from another API, Musixmatch, and stores the users personal favorite songs and playlists. The backend is deployed [here](https://vast-crag-31836.herokuapp.com).

Play also has a frontend, which displays views to the user & imparts and provides the interface for user interaction. The frontend repo is [here](ttps://github.com/abdullaqudrat/play_full_stack.git), and it is published [here](https://github.com/abdullaqudrat/play_full_stack_api/).

### Tech Stack
JavaScript, Knex, Mocha, Chai, pSQL


## Example Endpoints
### GET /api/v1/favorites
```
[
  {
    "id": 1,
    "name": "We Will Rock You",
    "artist_name": "Queen"
    "genre": "Rock",
    "song_rating": 88
  },
  {
    "id": 2,
    "name": "Careless Whisper",
    "artist_name": "George Michael"
    "genre": "Pop",
    "song_rating": 93
  },
]

```

### /api/v1/favorites
```
{
  "songs": {
    "id": 1,
    "name": "We Will Rock You",
    "artist_name": "Queen"
    "genre": "Rock",
    "song_rating": 88
  }
}
```
### Production
This app has been deployed to Heroku, and can be viewed in production  [here](https://vast-crag-31836.herokuapp.com/).

### Development
To view this app in development, clone down `https://github.com/abdullaqudrat/play_full_stack_api.git`.

Then install dependencies via `npm install`. Migrate and seed database with:
```
knex seed:run
knex migrate:latest
```

To get your server started, run `npm start`. After it has started, visit http://localhost:8080 in your browser to see the app.
