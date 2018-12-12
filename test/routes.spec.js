process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

beforeEach((done) => {
    database.migrate.latest()
      .then(() => done())
      .catch(error => {
        throw error;
      });
  });
  beforeEach((done) => {
    database.seed.run()
      .then(() => done())
      .catch(error => {
        throw error;
      });
  });
  afterEach((done) => {
    database.migrate.rollback()
    .then(() => done())
    .catch(error => {
        throw error;
      });
  });

describe('API Routes', () => {
    it('should return the homepage with text', done => {
        chai.request(server)
        .get('/')
        .end((err, response) => {
            response.should.have.status(200);
            response.should.be.html;
            response.res.text.should.equal('Welcome to Play API');
            done();
        });
    });
    it('should return a 404 for a route that does not exist', done => {
        chai.request(server)
        .get('/sad')
        .end((err, response) => {
            response.should.have.status(404);
            done();
        });
    });
    it('should return favorites', done => {
        chai.request(server)
        .get('/api/v1/favorites')
        .end((err, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('array');
            response.body.length.should.equal(3);
            response.body[0].should.have.property('id');
            response.body[0].id.should.equal(1);
            response.body[0].should.have.property('song_title');
            response.body[0].song_title.should.equal('Fight Me');
            response.body[0].should.have.property('artist_name');
            response.body[0].artist_name.should.equal('Rejects');
            response.body[0].should.have.property('genre');
            response.body[0].genre.should.equal('Rock');
            response.body[0].should.have.property('song_rating');
            response.body[0].song_rating.should.equal(34);
            done();
        });
    });
    it('should return a favorite', done => {
        chai.request(server)
        .get('/api/v1/favorites/1')
        .end((err, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('Object');
            response.body.should.have.property('id');
            response.body.id.should.equal(1);
            response.body.should.have.property('song_title');
            response.body.song_title.should.equal('Fight Me');
            response.body.should.have.property('artist_name');
            response.body.artist_name.should.equal('Rejects');
            response.body.should.have.property('genre');
            response.body.genre.should.equal('Rock');
            response.body.should.have.property('song_rating');
            response.body.song_rating.should.equal(34);
            done();
        });
    });
    it('should return a 404 for a favorite that does not exist', done => {
        chai.request(server)
        .get('/api/v1/favorites/100')
        .end((err, response) => {
            response.should.have.status(404);
            response.should.be.json;
            response.body.should.be.a('Object');
            response.body.should.have.property('error');
            response.body.error.should.equal('Could not find song with id 100');
          done();
        });
    });
});

//     it('should create a thing', done => {
//         chai.request(server)
//         .post('/api/v1/something')
//         .send({
//             thing1: 'this',
//             thing2: 'that'
//         });
//         .end((err, response) => {
//             response.should.have.status(201);
//             response.should.be.a('object');
//             response.should.have.property('id');
//             done();
//         });
//     });
// });

