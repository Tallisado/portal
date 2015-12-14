"use strict";

// Connection
var gitlab = require('gitlab')({
  url:   'http://nest.klipfolio.com',
  token: 'zUEzyyjGdvb_Fyzda-tA'
});
var Q = require("q");

function getMergeRequests() {
  var deffered = Q.defer();
  gitlab.projects.merge_requests.list(19, function(mrs) {
    console.log("1|"+mrs[0].title)
    // console.log("1|"+value)
    //return mrs[0].title;
    deffered.resolve( mrs[0].title )
  })
  return deffered.promise;
}



var promise = getMergeRequests();
promise.then(function(data) { console.log("LAST ALWAYS: " + data); }
);
    // Q.fcall(gitlab.projects.merge_requests.list(19, function(mrs) {
    //   console.log("1|"+mrs[0].title)
    //   // console.log("1|"+value)
    //   //return mrs[0].title;
    //   return mrs[0].title;
    //
    // })).then(function(data) {
    //   gitlab.projects.merge_requests.list(19, function(mrs) {
    //     console.log("2|"+mrs[0].title)
    //     // console.log("2|"+value)
    //     return mrs[0].title;
    //   })
    // }).then(function(data) {
    //   gitlab.projects.merge_requests.list(19, function(mrs) {
    //     console.log("3|"+mrs[0].title)
    //     // console.log("2|"+value)
    //     return Q(mrs[0].title);
    //   })
    // }).then(function(data) {
    //   gitlab.projects.merge_requests.list(19, function(mrs) {
    //     console.log("4|"+mrs[0].title)
    //     // console.log("2|"+value)
    //     return Q(mrs[0].title);
    //   })
    // }).then(function(data) {
    //   gitlab.projects.merge_requests.list(19, function(mrs) {
    //     console.log("5|"+mrs[0].title)
    //     // console.log("2|"+value)
    //     return Q(mrs[0].title);
    //   })
    // }).fin(function () {
    //   console.log("always LAST")
    // });

      //return Q.delay(value, 1000);

//
//
// data1("intial").then(data1("BBBBB")).then(data("FFFFF")).then(qux);
//
// function eventually(value) {
//     switch(value) {
//       case 1: return data1(1);
//       case 2: return data1(2);
//       case 3: return data1(3);
//     }
// }
//
// Q.all([1, 2, 3].map(eventually))
// .done(function (result) {
//     console.log("rsult" + result);
// });
//

//
// Q.all([
//     data1(10),
//     data1(20)
// ])
// .spread(function (x, y) {
//     console.log(x, y);
// })
// .done();




// // // mod.js
//  var Q = require('q');
// //
// // module.exports = {
// //     getFullName: function (firstName, lastName, callback) {
// //         var deferred = Q.defer();
// //
// //         if (firstName && lastName) {
// //             var fullName = firstName + " " + lastName;
// //             deferred.resolve(fullName);
// //         }
// //         else {
// //             deferred.reject("First and last name must be passed.");
// //         }
// //
// //         deferred.promise.nodeify(callback);
// //         return deferred.promise;
// //     }
// //     scrapeAPI: function () {
// //       var deferred = $q.defer();
// //       var promise = deferred.promise.then(firstFn).then(secondFn).then(thirdFn, errorFn);
// //     }
// // }
// //
// // var firstFn = function(param) {
// //     // do something with param
// //     if (param == 'bad value') {
// //       return $q.reject('invalid value');
// //     } else {
// //       return 'firstResult';
// //     }
// //  };
// //
// //  var secondFn = function(param) {
// //     // do something with param
// //     if (param == 'bad value') {
// //       return $q.reject('invalid value');
// //     } else {
// //       return 'secondResult';
// //     }
// //  };
// //
// //  var thirdFn = function(param) {
// //     // do something with param
// //     return 'thirdResult';
// //  };
// //
// //  var errorFn = function(message) {
// //    // handle error
// //  };
// //
// //
//
// var target_saas_id =  parseInt(process.argv[2]);
// var utrack_user =     process.env.GITLAB_USER
// var utrack_pass =     process.env.GITLAB_PASS
//
// var utrack_project_url  = 'http://nest.klipfolio.com'
//
// // #18: data-connector
// // #13: refresh
// // #29: expression-evaluator
// // #19: saas-webui
// // #21: saas-data-provider
// // #20: data-formula
//
//
// var utrack_project_id_dc      = 18
// var utrack_project_id_ref     = 13
// var utrack_project_id_eval    = 29
// var utrack_project_id_webui   = 19
// var utrack_project_id_dpn     = 21
// var utrack_project_id_df      = 20
//
// // Connection
// var gitlab = require('gitlab')({
//   url:   'http://nest.klipfolio.com',
//   token: 'zUEzyyjGdvb_Fyzda-tA'
// });
//
//
// var release = {}
// release.utrack_id1 = "5932"
// projectName = "saas-webui"
// //
// //
// // var deferred = Q.defer();
// //  setTimeout(deferred.resolve, ms);
// //  return deferred.promise;
//
//
// var promise = Q.fcall(function () {
//       console.log('q call')
//       var deferred = Q.defer();
//        setTimeout(deferred.resolve, ms);
//        return deferred.promise;
//     })
//     .then(function (username) {
//       console.log('git call')
//       var mr_array = []
//       gitlab.projects.merge_requests.list(19, function(mrs) {
//         console.log('git call')
//         //console.log(mrs)
//         for (var i = 0; i < mrs.length; i++) {
//           // console.log("checking title for id");
//           //console.log(mrs[i].title + " " + release.utrack_id1);
//           if (mrs[i].title.indexOf(release.utrack_id1) > -1) {
//             var mr_link = "http://nest.klipfolio.com/saas/" + projectName + "/merge_requests/" + mrs[i].iid
//             console.log("#"+release.utrack_id1+" -- " + mr_link)
//             console.log(mrs[i])
//             mr_array.push(mr_link)
//
//           }
//         };
//         return mr_array
//       });
//   }, function (error) {
//     console.log('git cerror')
//     // We only get here if "foo" fails
//   })
//   .then(function (user) {
//       console.log("Lets use the value from userName?");
//   }, function (error) {
//     console.log('3rd cerror')
//     // We only get here if "foo" fails
//   });
//
// //
// // var firstFn = function(param) {
// //   var deferred = Q.defer();
// //
// //   console.log("1")
// //   var mr_array = []
// //   console.log("git time in server release")
// //   gitlab.projects.merge_requests.list(19, function(mrs) {
// //     //console.log(mrs)
// //     for (var i = 0; i < mrs.length; i++) {
// //       // console.log("checking title for id");
// //       //console.log(mrs[i].title + " " + release.utrack_id1);
// //       if (mrs[i].title.indexOf(release.utrack_id1) > -1) {
// //         var mr_link = "http://nest.klipfolio.com/saas/" + projectName + "/merge_requests/" + mrs[i].iid
// //         console.log("#"+release.utrack_id1+" -- " + mr_link)
// //         console.log(mrs[i])
// //         mr_array.push(mr_link)
// //         deferred.resolve(mr_array);
// //       }
// //     };
// //   });
// //   // do something with param
// //   if (param == 'bad value') {
// //     return $q.reject('invalid value');
// //   } else {
// //     return 'firstResult';
// //   }
// //
// // };
// //
// // var saveRelease = function(param) {
// //   console.log("saving in server release")
// //   release.save(function (err) {
// //     if (err) {
// //       return res.status(400).send({
// //         message: errorHandler.getErrorMessage(err)
// //       });
// //     } else {
// //       console.log(mr_array)
// //       release.mr_links = mr_array;
// //       res.json(release);
// //     }
// //   })
// //   // do something with param
// //   if (param == 'bad value') {
// //     return $q.reject('invalid value');
// //   } else {
// //     return 'secondResult';
// //   }
// // };
// //
// //
// // var errorFn = function(message) {
// //  console.log("err")
// //
// //  // handle error
// // };
// //
// // var deferred = Q.defer();
// // var promise = deferred.promise.then(firstFn).then(secondFn).then(thirdFn, errorFn);
// //
// // deferred.resolve("BLAH")
