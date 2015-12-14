// https://www.npmjs.com/package/youtrack-rest-node-library
// https://github.com/node-gitlab/node-gitlab
var target_saas_id =  parseInt(process.argv[2]);
var utrack_user =     process.env.GITLAB_USER
var utrack_pass =     process.env.GITLAB_PASS

var utrack_project_url  = 'http://nest.klipfolio.com'

// #18: data-connector
// #13: refresh
// #29: expression-evaluator
// #19: saas-webui
// #21: saas-data-provider
// #20: data-formula


var utrack_project_id_dc      = 18
var utrack_project_id_ref     = 13
var utrack_project_id_eval    = 29
var utrack_project_id_webui   = 19
var utrack_project_id_dpn     = 21
var utrack_project_id_df      = 20

// Connection
var gitlab = require('gitlab')({
  url:   'http://nest.klipfolio.com',
  token: 'zUEzyyjGdvb_Fyzda-tA'
});

//process.stdout.write('\u001B[2J\u001B[0;0f');


// var webui_branch_names = [];
// var webui_branch_messages = [];
// gitlab.projects.repository.listBranches( utrack_project_id, function(branches) {
//   for (var i = 0; i < branches.length; i++) {
//     console.log(branches[i].name)
//     var branch_name = branches[i].name
//     var branch_message = branches[i].commit.message
//
//     if (branch_message.indexOf(target_saas_id) > -1) {
//       webui_branch_names.push("http://nest.klipfolio.com/saas/saas-webui/commits/" + branches[i].name);
//       webui_branch_messages.push(branches[i].commit.message);
//     }
//   }
//   console.log("=== BRANCHES ===");
//   console.log(webui_branch_names.length);
//
//   for (var i = 0; i < webui_branch_names.length; i++) {
//
//     console.log("::nest url::");
//     console.log("http://nest.klipfolio.com/saas/saas-webui/commits/" + webui_branch_names[i]);
//     console.log(webui_branch_messages);
//   }
//
// });

// function collectBranches(projectId, projectName, name_array, message_array) {
//   var webui_branch_names = [];
//   var webui_branch_messages = [];
//   gitlab.projects.repository.listBranches( projectId, function(branches) {
//     for (var i = 0; i < branches.length; i++) {
//       var branch_name = branches[i].name
//       var branch_message = branches[i].commit.message
//
//       if (branch_message.indexOf(target_saas_id) > -1) {
//         name_array.push("http://nest.klipfolio.com/saas/" + projectName + "saas-webui/commits/" + branches[i].name);
//         message_array.push(branches[i].commit.message);
//       }
//     }
//     console.log("=== BRANCHES ===");
//
//     for (var i = 0; i < name_array.length; i++) {
//
//       //console.log("::nest url::");
//       //console.log("http://nest.klipfolio.com/saas/saas-webui/commits/" + name_array[i]);
//       console.log(message_array);
//     }
//
//   });
// }
//
// var mr_list = [] // name & mr_link
//
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





// http://nest.klipfolio.com/saas/saas-webui/merge_requests/626

// collectMR(19, "saas-webui", mr_list);
// var webui_branch_names = [];
// var webui_branch_messages = [];
// collectBranches(utrack_project_id_webui, 'saas-webui', webui_branch_names, webui_branch_messages)

// Listing users
// gitlab.users.all(function(users) {
//   for (var i = 0; i < users.length; i++) {
//     console.log("#" + users[i].id + ": " + users[i].email + ", " + users[i].name + ", " + users[i].created_at);
//   }
// });

////// Listing projects
// gitlab.projects.all(function(projects) {
//   for (var i = 0; i < projects.length; i++) {
//
//     projects[i].id
//     projects[i].name
//
//
//
//     console.log("#" + projects[i].id + ": " + projects[i].name + ", path: "
//       + projects[i].path + ", default_branch: " + projects[i].default_branch + ", private: "
//       + projects[i]["private"] + " date: "
//       + projects[i].created_at);
//   }
// });
