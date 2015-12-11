'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Release = mongoose.model('Release'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var Client = require('node-rest-client').Client;

var DEFAULT_EXPIRE_MIN = 60;

function dateAdd(date, interval, units) {
  var ret = new Date(date); //don't change original date
  switch(interval.toLowerCase()) {
    case 'year'   :  ret.setFullYear(ret.getFullYear() + units);  break;
    case 'quarter':  ret.setMonth(ret.getMonth() + 3*units);  break;
    case 'month'  :  ret.setMonth(ret.getMonth() + units);  break;
    case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
    case 'day'    :  ret.setDate(ret.getDate() + units);  break;
    case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
    case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
    case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
    default       :  ret = undefined;  break;
  }
  return ret;
}

/**
 * Create a release
 */
exports.create = function (req, res) {
  var release = new Release(req.body);
  release.user = req.user;


  // need tc data call here
  // URLLIB CODE HERE
  console.log("[server] triggering urllib on release creation");
  console.log("[server] ASKING TC FOR DATA (FAKE)");
  var tc = {ip: '192.168.1.1', fqdn: "super.klipfolio.com"};

  if (release.release_name && release.force) {
    console.log('BLOW AWAY VM AND REUSE');
  } else {
    var full_release_list = ['docker1', 'docker2', 'docker3', 'docker4', 'docker5', 'docker6', 'docker7', 'docker8', 'docker9', 'docker10']; // master list
    Release.find({ release_name: { $in: full_release_list } }).exec(function (err, releases) {
      if (err) {
        console.log("ERROR");
      }
      else {
        var existing_release_list = [];
        releases.forEach(function(item) {
          existing_release_list.push(item.release_name);
        });
        console.log("existing_releases: " + existing_release_list);
        var usable_release_list = full_release_list.filter( function( el ) {
          return existing_release_list.indexOf( el ) < 0;
        });
        console.log("usable releases: " + usable_release_list);

        if (usable_release_list.length === 0) {
          // Nothing Free
          console.log("NO VMS ARE AVAILABLE");
        }
        else {
          var d = new Date();
          var expire = release.expire ? dateAdd(d, 'minute', release.expire) : dateAdd(d, 'minute', DEFAULT_EXPIRE_MIN);
          console.log("expire mins: " + release.expire);
          release.release_name = usable_release_list[0];
          release.expire = expire;
          release.ip = tc.ip;
          release.fqdn = tc.fqdn;
          console.log("USING VM: " + release.release_name);
          release.save(function (err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.json(release);
            }
          });
        }
      }
    });
  }



};

/**
 * Show the current release
 */
exports.read = function (req, res) {
  res.json(req.release);
};

/**
 * Update a release
 */
exports.update = function (req, res) {
  var release = req.release;

  release.title = req.body.title;
  release.content = req.body.content;

  release.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(release);
    }
  });
};

/**
 * Delete an release
 */
exports.delete = function (req, res) {
  var release = req.release;

  release.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(release);
    }
  });
};

/**
 * List of Releases
 */
exports.list = function (req, res) {
  Release.find().sort('-created').populate('user', 'displayName').exec(function (err, releases) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(releases);
    }
  });
};

/**
 * Release middleware
 */
exports.releaseByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Release is invalid'
    });
  }

  Release.findById(id).populate('user', 'displayName').exec(function (err, release) {
    if (err) {
      return next(err);
    } else if (!release) {
      return res.status(404).send({
        message: 'No release with that identifier has been found'
      });
    }
    req.release = release;
    next();
  });
};
