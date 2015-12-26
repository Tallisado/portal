'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Release = mongoose.model('Release'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var gitlab = require('gitlab')({
  url:   'http://nest.klipfolio.com',
  token: 'zUEzyyjGdvb_Fyzda-tA'
});

// var SlackBot = require('slackbots');

var port = 3030;
var channel = "hackday"
//
// var bot = new SlackBot({
//     token: 'xoxb-11660487557-claMDxXFYT94TEMSpxQH8lsI', // Add a bot https://my.slack.com/services/new/bot and put the token
//     name: 'Ratchet'
// });
// var Connection = require('youtrack-rest-node-library');
//
// var youtrack = new Connection('http://medlab:11000/');
// utrack_auth_string = "'" + process.env.UTRACK_USER + ',' + process.env.UTRACK_PASSWORD + "'";
// youtrack.login(utrack_auth_string, function(err){
//     youtrack.getProject('Development', function(err, project){
//     })
// })


// var Connection = require('youtrack-rest-node-library');
//
// var youtrack = new Connection('http://medlab:11000/');
// utrack_auth_string = "'" + process.env.UTRACK_USER + ',' + process.env.UTRACK_PASSWORD + "'";
// youtrack.login(utrack_auth_string, function(err){
//     youtrack.getProject('Development', function(err, project){
//     })
// })




// // TODO: need defer and promise to link together all the projects
// function collectMR(projectId, projectName, mr_array) {
//   var webui_branch_names = [];
//   var webui_branch_messages = [];
//   gitlab.projects.merge_requests.list(projectId, function(mrs) {
//     for (var i = 0; i < mrs.length; i++) {
//       if (mrs[i].title.indexOf(target_saas_id) > -1) {
//         var mr_link = "http://nest.klipfolio.com/saas/" + projectName + "/merge_requests/" + mrs[i].iid
//         console.log("#"+target_saas_id+" -- " + mr_link)
//         mr_array.push(mr_link)
//       }
//     }
//   });
// };

var DEFAULT_EXPIRE_MIN = 60;
var utrack_user =     process.env.GITLAB_USER
var utrack_pass =     process.env.GITLAB_PASS
var projectName =     "saas-webui"

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
//
//
// exports.slackMsg = function (req, res, next, id) {
//   console.log(id);
//   console.log("slackMsg");
// };


/**
 * Create a release
 */
exports.create = function (req, res) {
  var release = new Release(req.body);
  release.user = req.user;

  console.log("create in server release")

  var mr_array = []
  console.log("git time in server release")
  gitlab.projects.merge_requests.list(19, function(mrs) {
    //console.log(mrs)
    for (var i = 0; i < mrs.length; i++) {
      // console.log("checking title for id");
      //console.log(mrs[i].title + " " + release.utrack_id1);
      if (mrs[i].title.indexOf(release.utrack_id1) > -1) {
        var mr_link = "http://nest.klipfolio.com/saas/" + projectName + "/merge_requests/" + mrs[i].iid
        console.log("#"+release.utrack_id1+" -- " + mr_link)
        console.log(mrs[i])
        mr_array.push(mr_link)
      }
    }
    console.log("saving in server release")
    release.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        console.log(mr_array)
        release.mr_links = mr_array;
        res.json(release);
      }
    });
  });
  console.log("end of create in server release")
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
  //
  if (req.body.slack == "1") {
    console.log("SLACK TIME : canary");
    // bot.postMessageToChannel("testrelease", 'Release on *Canary* (http://app.klipfolio.com): \nFor release notes see: ' + "http://192.168.1.89:3000/releases/" + req.body._id);
    return res.status(200).send({});
    //res.json(release);
  } else if (req.body.slack == "2"){
    console.log("SLACK TIME : production ");
    // bot.postMessageToChannel("testrelease", 'Release on *Production* (http://app.klipfolio.com): \nFor release notes see: ' + "http://192.168.1.89:3000/releases/" + req.body._id);
    return res.status(200).send({});
    //res.json(release);
  }

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
