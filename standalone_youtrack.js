// var Connection = require('youtrack-rest-node-library');
//
// var youtrack = new Connection('http://medlab:11000');
// utrack_auth_string = process.env.UTRACK_USER + ',' + process.env.UTRACK_PASS;
//
// //for (var k in global.youtrack) { console.log(k); }
//
// //console.log("CREDS: " + utrack_auth_string );
//
// youtrack.login('tvanek@klipfolio.com', 'Zxvf1234', function(err){
//     console.log(err);
//     youtrack.request('Your-ID', function(err, project){
//       console.log('asdasd')
//     })
// })
//
//
// // youtrack.login("tvanek", process.env.UTRACK_PASS , function(err, x){
// // //youtrack.login("'"+utrack_auth_string+"'", function(err){
// //   for (var k in youtrack) { console.log(k); }
// //   console.log(err)
// //   console.log(x)
// //   //console.log(youtrack)
// //   console.log("logged")
// // //
// //     youtrack.getProject('Development', function(err, project){
// //         console.log("Development Project")
// //         console.log(err)
// //         console.log(project)
// //     })
// // //     youtrack.getProjects(function(err, project){
// // //         console.log("Development Project")
// // //         console.log(err)
// // //         console.log(project)
// // //     })
// // })
//
// console.log("end")


//

var rest = require('restler');

///POST /rest/user/login?{login}&{password}

// rest.post('http://medlab:11000/rest/user/login',{login: process.env.UTRACK_USER, password: process.env.UTRACK_PASS}).on('timeout', function(ms){
//   console.log('did not return within '+ms+' ms');
// }).on('complete',function(data,response){
//   console.log('did not time out');
//   console.log(response);
//   console.log(data);
//
//   // rest.get("http://medlab/rest/admin/project").on('timeout', function(ms){
//   //   console.log('did not return within '+ms+' ms');
//   // }).on('complete',function(data,response){
//   //   console.log('did not time out 2');
//   //   console.log(data);
//   //   //console.log(response);
//   // });
//   // rest.get("http://medlab/rest/admin/project", {projectId: 'Development'}).on('timeout', function(ms){
//   //   console.log('did not return within '+ms+' ms');
//   // }).on('complete',function(data,response){
//   //   console.log('did not time out 2');
//   //   //console.log(response);
//   // });
// });

///// rest/admin/project

var cookie = ''

rest.post('http://medlab:11000/rest/user/login', {
  data: {
    login: 'tvanek@klipfolio.com',
    password: 'Zxvf1234'
  },
}).on('complete', function(data, response) {
  console.log(data);

  cookie = response.headers['set-cookie'][0].split(';')[0]//.split('=')[1]
  console.log(cookie);

  //
  // var cookies = _.map(response.cookies, function(val, key) {
  //     return key + "=" + encodeURIComponent(val);
  // }).join("; ");
  // console.log(cookies);

  rest.get('http://medlab:11000/rest/admin/project', {
    headers : { cookie : cookie }
  }).on('complete', function(response) {
    console.log('Restler received a response:', response);
    process.exit(0);
  });
  });
//
//
// var jsonData = { login: 'tvanek@klipfolio.com', password: 'Zxvf1234' };
// rest.postJson('http://medlab:11000/rest/user/login', jsonData).on('complete', function(data, response) {
//     console.log(data);
// });
