'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Harness = mongoose.model('Harness'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var Client =  require('node-rest-client').Client;

/**
 * Create a harness
 */
exports.create = function (req, res) {
  var harness = new Harness(req.body);
  harness.user = req.user;


  // need tc data call here
  // URLLIB CODE HERE
  console.log("[server] triggering urllib on harness creation");

  harness.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(harness);
    }
  });
};

/**
 * Show the current harness
 */
exports.read = function (req, res) {
  res.json(req.harness);
};

/**
 * Update a harness
 */
exports.update = function (req, res) {
  var harness = req.harness;

  harness.title = req.body.title;
  harness.content = req.body.content;

  harness.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(harness);
    }
  });
};

/**
 * Delete an harness
 */
exports.delete = function (req, res) {
  var harness = req.harness;

  harness.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(harness);
    }
  });
};

/**
 * List of Harnesses
 */
exports.list = function (req, res) {
  Harness.find().sort('-created').populate('user', 'displayName').exec(function (err, harnesses) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(harnesses);
    }
  });
};

/**
 * Harness middleware
 */
exports.harnessByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Harness is invalid'
    });
  }

  Harness.findById(id).populate('user', 'displayName').exec(function (err, harness) {
    if (err) {
      return next(err);
    } else if (!harness) {
      return res.status(404).send({
        message: 'No harness with that identifier has been found'
      });
    }
    req.harness = harness;
    next();
  });
};
