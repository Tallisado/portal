'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Vm = mongoose.model('Vm'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, vm;

/**
 * Vm routes tests
 */
describe('Vm CRUD tests', function () {
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

    // Save a user to the test db and create new vm
    user.save(function () {
      vm = {
        title: 'Vm Title',
        content: 'Vm Content'
      };

      done();
    });
  });

  it('should be able to save an vm if logged in', function (done) {
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

        // Save a new vm
        agent.post('/api/vms')
          .send(vm)
          .expect(200)
          .end(function (vmSaveErr, vmSaveRes) {
            // Handle vm save error
            if (vmSaveErr) {
              return done(vmSaveErr);
            }

            // Get a list of vms
            agent.get('/api/vms')
              .end(function (vmsGetErr, vmsGetRes) {
                // Handle vm save error
                if (vmsGetErr) {
                  return done(vmsGetErr);
                }

                // Get vms list
                var vms = vmsGetRes.body;

                // Set assertions
                (vms[0].user._id).should.equal(userId);
                (vms[0].title).should.match('Vm Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an vm if not logged in', function (done) {
    agent.post('/api/vms')
      .send(vm)
      .expect(403)
      .end(function (vmSaveErr, vmSaveRes) {
        // Call the assertion callback
        done(vmSaveErr);
      });
  });

  it('should not be able to save an vm if no title is provided', function (done) {
    // Invalidate title field
    vm.title = '';

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

        // Save a new vm
        agent.post('/api/vms')
          .send(vm)
          .expect(400)
          .end(function (vmSaveErr, vmSaveRes) {
            // Set message assertion
            (vmSaveRes.body.message).should.match('Title cannot be blank');

            // Handle vm save error
            done(vmSaveErr);
          });
      });
  });

  it('should be able to update an vm if signed in', function (done) {
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

        // Save a new vm
        agent.post('/api/vms')
          .send(vm)
          .expect(200)
          .end(function (vmSaveErr, vmSaveRes) {
            // Handle vm save error
            if (vmSaveErr) {
              return done(vmSaveErr);
            }

            // Update vm title
            vm.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing vm
            agent.put('/api/vms/' + vmSaveRes.body._id)
              .send(vm)
              .expect(200)
              .end(function (vmUpdateErr, vmUpdateRes) {
                // Handle vm update error
                if (vmUpdateErr) {
                  return done(vmUpdateErr);
                }

                // Set assertions
                (vmUpdateRes.body._id).should.equal(vmSaveRes.body._id);
                (vmUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of vms if not signed in', function (done) {
    // Create new vm model instance
    var vmObj = new Vm(vm);

    // Save the vm
    vmObj.save(function () {
      // Request vms
      request(app).get('/api/vms')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single vm if not signed in', function (done) {
    // Create new vm model instance
    var vmObj = new Vm(vm);

    // Save the vm
    vmObj.save(function () {
      request(app).get('/api/vms/' + vmObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', vm.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single vm with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/vms/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Vm is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single vm which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent vm
    request(app).get('/api/vms/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No vm with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an vm if signed in', function (done) {
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

        // Save a new vm
        agent.post('/api/vms')
          .send(vm)
          .expect(200)
          .end(function (vmSaveErr, vmSaveRes) {
            // Handle vm save error
            if (vmSaveErr) {
              return done(vmSaveErr);
            }

            // Delete an existing vm
            agent.delete('/api/vms/' + vmSaveRes.body._id)
              .send(vm)
              .expect(200)
              .end(function (vmDeleteErr, vmDeleteRes) {
                // Handle vm error error
                if (vmDeleteErr) {
                  return done(vmDeleteErr);
                }

                // Set assertions
                (vmDeleteRes.body._id).should.equal(vmSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an vm if not signed in', function (done) {
    // Set vm user
    vm.user = user;

    // Create new vm model instance
    var vmObj = new Vm(vm);

    // Save the vm
    vmObj.save(function () {
      // Try deleting vm
      request(app).delete('/api/vms/' + vmObj._id)
        .expect(403)
        .end(function (vmDeleteErr, vmDeleteRes) {
          // Set message assertion
          (vmDeleteRes.body.message).should.match('User is not authorized');

          // Handle vm error error
          done(vmDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Vm.remove().exec(done);
    });
  });
});
