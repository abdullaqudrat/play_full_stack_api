const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

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
          response.res.text.should.equal('[{"id":1,"song_title":"hello","artist_name":"world","genre":"rock","song_rating":1,"created_at":"2018-12-04T22:41:24.675Z","updated_at":"2018-12-04T22:41:24.675Z"},{"id":2,"song_title":"hello","artist_name":"world","genre":"rock","song_rating":1,"created_at":"2018-12-04T22:42:02.576Z","updated_at":"2018-12-04T22:42:02.576Z"},{"id":3,"song_title":"hello","artist_name":"world","genre":"rock","song_rating":1,"created_at":"2018-12-04T22:42:23.914Z","updated_at":"2018-12-04T22:42:23.914Z"},{"id":4,"song_title":"hello","artist_name":"world","genre":"rock","song_rating":1,"created_at":"2018-12-04T23:45:44.661Z","updated_at":"2018-12-04T23:45:44.661Z"},{"id":5,"song_title":"hello","artist_name":"world","genre":"rock","song_rating":1,"created_at":"2018-12-04T23:46:26.423Z","updated_at":"2018-12-04T23:46:26.423Z"},{"id":6,"song_title":"hello","artist_name":"world","genre":"rock","song_rating":1,"created_at":"2018-12-04T23:46:34.889Z","updated_at":"2018-12-04T23:46:34.889Z"},{"id":7,"song_title":"hello","artist_name":"world","genre":"rock","song_rating":1,"created_at":"2018-12-04T23:47:43.058Z","updated_at":"2018-12-04T23:47:43.058Z"}]');
          done();
        });
    });
});

describe('My API routes', () => {
    before((done) => {
        database.migrate.latest()
        .then( () => done())
        .catch(error => {
            throw error;
        });
    });
    beforeEach((done) => {
        database.seed.run()
        .then( () => done())
        .catch(error => {
            throw error;
        });
    });
    // after((done) => {

    // });

    it('should create a thing', done => {
        chai.request(server)
        .post('/api/v1/something')
        .send({
            thing1: 'this',
            thing2: 'that'
        });
        .end((err, response) => {
            response.should.have.status(201);
            response.should.be.a('object');
            response.should.have.property('id');
            done();
        });
    });
});

