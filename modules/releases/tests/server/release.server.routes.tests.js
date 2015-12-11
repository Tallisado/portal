'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Release = mongoose.model('Release'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, release;

/**
 * Release routes tests
 */
describe('Release CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'password'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new release
    user.save(function () {
      release = {
        title: 'Release Title',
        content: 'Release Content'
      };

      done();
    });
  });

  it('should be able to save an release if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new release
        agent.post('/api/releases')
          .send(release)
          .expect(200)
          .end(function (releaseSaveErr, releaseSaveRes) {
            // Handle release save error
            if (releaseSaveErr) {
              return done(releaseSaveErr);
            }

            // Get a list of releases
            agent.get('/api/releases')
              .end(function (releasesGetErr, releasesGetRes) {
                // Handle release save error
                if (releasesGetErr) {
                  return done(releasesGetErr);
                }

                // Get releases list
                var releases = releasesGetRes.body;

                // Set assertions
                (releases[0].user._id).should.equal(userId);
                (releases[0].title).should.match('Release Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an release if not logged in', function (done) {
    agent.post('/api/releases')
      .send(release)
      .expect(403)
      .end(function (releaseSaveErr, releaseSaveRes) {
        // Call the assertion callback
        done(releaseSaveErr);
      });
  });

  it('should not be able to save an release if no title is provided', function (done) {
    // Invalidate title field
    release.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new release
        agent.post('/api/releases')
          .send(release)
          .expect(400)
          .end(function (releaseSaveErr, releaseSaveRes) {
            // Set message assertion
            (releaseSaveRes.body.message).should.match('Title cannot be blank');

            // Handle release save error
            done(releaseSaveErr);
          });
      });
  });

  it('should be able to update an release if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new release
        agent.post('/api/releases')
          .send(release)
          .expect(200)
          .end(function (releaseSaveErr, releaseSaveRes) {
            // Handle release save error
            if (releaseSaveErr) {
              return done(releaseSaveErr);
            }

            // Update release title
            release.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing release
            agent.put('/api/releases/' + releaseSaveRes.body._id)
              .send(release)
              .expect(200)
              .end(function (releaseUpdateErr, releaseUpdateRes) {
                // Handle release update error
                if (releaseUpdateErr) {
                  return done(releaseUpdateErr);
                }

                // Set assertions
                (releaseUpdateRes.body._id).should.equal(releaseSaveRes.body._id);
                (releaseUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of releases if not signed in', function (done) {
    // Create new release model instance
    var releaseObj = new Release(release);

    // Save the release
    releaseObj.save(function () {
      // Request releases
      request(app).get('/api/releases')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single release if not signed in', function (done) {
    // Create new release model instance
    var releaseObj = new Release(release);

    // Save the release
    releaseObj.save(function () {
      request(app).get('/api/releases/' + releaseObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', release.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single release with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/releases/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Release is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single release which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent release
    request(app).get('/api/releases/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No release with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an release if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new release
        agent.post('/api/releases')
          .send(release)
          .expect(200)
          .end(function (releaseSaveErr, releaseSaveRes) {
            // Handle release save error
            if (releaseSaveErr) {
              return done(releaseSaveErr);
            }

            // Delete an existing release
            agent.delete('/api/releases/' + releaseSaveRes.body._id)
              .send(release)
              .expect(200)
              .end(function (releaseDeleteErr, releaseDeleteRes) {
                // Handle release error error
                if (releaseDeleteErr) {
                  return done(releaseDeleteErr);
                }

                // Set assertions
                (releaseDeleteRes.body._id).should.equal(releaseSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an release if not signed in', function (done) {
    // Set release user
    release.user = user;

    // Create new release model instance
    var releaseObj = new Release(release);

    // Save the release
    releaseObj.save(function () {
      // Try deleting release
      request(app).delete('/api/releases/' + releaseObj._id)
        .expect(403)
        .end(function (releaseDeleteErr, releaseDeleteRes) {
          // Set message assertion
          (releaseDeleteRes.body.message).should.match('User is not authorized');

          // Handle release error error
          done(releaseDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Release.remove().exec(done);
    });
  });
});
