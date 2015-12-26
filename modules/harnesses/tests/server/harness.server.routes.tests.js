'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Harness = mongoose.model('Harness'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, harness;

/**
 * Harness routes tests
 */
describe('Harness CRUD tests', function () {
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

    // Save a user to the test db and create new harness
    user.save(function () {
      harness = {
        title: 'Harness Title',
        content: 'Harness Content'
      };

      done();
    });
  });

  it('should be able to save an harness if logged in', function (done) {
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

        // Save a new harness
        agent.post('/api/harnesses')
          .send(harness)
          .expect(200)
          .end(function (harnessSaveErr, harnessSaveRes) {
            // Handle harness save error
            if (harnessSaveErr) {
              return done(harnessSaveErr);
            }

            // Get a list of harnesses
            agent.get('/api/harnesses')
              .end(function (harnessesGetErr, harnessesGetRes) {
                // Handle harness save error
                if (harnessesGetErr) {
                  return done(harnessesGetErr);
                }

                // Get harnesses list
                var harnesses = harnessesGetRes.body;

                // Set assertions
                (harnesses[0].user._id).should.equal(userId);
                (harnesses[0].title).should.match('Harness Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an harness if not logged in', function (done) {
    agent.post('/api/harnesses')
      .send(harness)
      .expect(403)
      .end(function (harnessSaveErr, harnessSaveRes) {
        // Call the assertion callback
        done(harnessSaveErr);
      });
  });

  it('should not be able to save an harness if no title is provided', function (done) {
    // Invalidate title field
    harness.title = '';

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

        // Save a new harness
        agent.post('/api/harnesses')
          .send(harness)
          .expect(400)
          .end(function (harnessSaveErr, harnessSaveRes) {
            // Set message assertion
            (harnessSaveRes.body.message).should.match('Title cannot be blank');

            // Handle harness save error
            done(harnessSaveErr);
          });
      });
  });

  it('should be able to update an harness if signed in', function (done) {
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

        // Save a new harness
        agent.post('/api/harnesses')
          .send(harness)
          .expect(200)
          .end(function (harnessSaveErr, harnessSaveRes) {
            // Handle harness save error
            if (harnessSaveErr) {
              return done(harnessSaveErr);
            }

            // Update harness title
            harness.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing harness
            agent.put('/api/harnesses/' + harnessSaveRes.body._id)
              .send(harness)
              .expect(200)
              .end(function (harnessUpdateErr, harnessUpdateRes) {
                // Handle harness update error
                if (harnessUpdateErr) {
                  return done(harnessUpdateErr);
                }

                // Set assertions
                (harnessUpdateRes.body._id).should.equal(harnessSaveRes.body._id);
                (harnessUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of harnesses if not signed in', function (done) {
    // Create new harness model instance
    var harnessObj = new Harness(harness);

    // Save the harness
    harnessObj.save(function () {
      // Request harnesses
      request(app).get('/api/harnesses')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single harness if not signed in', function (done) {
    // Create new harness model instance
    var harnessObj = new Harness(harness);

    // Save the harness
    harnessObj.save(function () {
      request(app).get('/api/harnesses/' + harnessObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', harness.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single harness with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/harnesses/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Harness is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single harness which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent harness
    request(app).get('/api/harnesses/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No harness with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an harness if signed in', function (done) {
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

        // Save a new harness
        agent.post('/api/harnesses')
          .send(harness)
          .expect(200)
          .end(function (harnessSaveErr, harnessSaveRes) {
            // Handle harness save error
            if (harnessSaveErr) {
              return done(harnessSaveErr);
            }

            // Delete an existing harness
            agent.delete('/api/harnesses/' + harnessSaveRes.body._id)
              .send(harness)
              .expect(200)
              .end(function (harnessDeleteErr, harnessDeleteRes) {
                // Handle harness error error
                if (harnessDeleteErr) {
                  return done(harnessDeleteErr);
                }

                // Set assertions
                (harnessDeleteRes.body._id).should.equal(harnessSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an harness if not signed in', function (done) {
    // Set harness user
    harness.user = user;

    // Create new harness model instance
    var harnessObj = new Harness(harness);

    // Save the harness
    harnessObj.save(function () {
      // Try deleting harness
      request(app).delete('/api/harnesses/' + harnessObj._id)
        .expect(403)
        .end(function (harnessDeleteErr, harnessDeleteRes) {
          // Set message assertion
          (harnessDeleteRes.body.message).should.match('User is not authorized');

          // Handle harness error error
          done(harnessDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Harness.remove().exec(done);
    });
  });
});
