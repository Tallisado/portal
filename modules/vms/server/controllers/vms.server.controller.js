'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Vm = mongoose.model('Vm'),
  Harness = mongoose.model('Harness'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var Client =  require('node-rest-client').Client;

var TeamCity = require('teamcity-notifier');

var tc = new TeamCity({
  host: 'teamcity-server',
  port: 80,
  user: 'username',
  password: 'password'
});

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
 * Create a vm
 */
var buildInterval = null
var build

exports.create = function (req, res) {
  var vm = new Vm(req.body);
  vm.user = req.user;
  var harness = new Harness(req.body);
  harness.user = req.user;


  // console.log("create causing refresh service");
  // setInterval(function(){
  //   console.log("create causing refresh service");
  // }, 10000);

  console.log("create causing refresh service");
  setInterval(function(){
    console.log(" (stale expiry) removing refresh service on this build: " + harness._id );
    tc.stop();
  }, 1060000);

  tc.on('new-build', function(build) {
    console.log('------ New build started for ' + build.buildTypeId);
    if (build.VMNAME == harness.vm_name && build.parameter.UID == harness._id) {
      buildId = build.buildId

      tc.on('finished-build', function(build) {
        console.log('Build finished for ' + build.buildTypeId);
        if (buildId == build.buildTypeId) {
          console.log('------ Our Build is DONE' + build.buildTypeId);
          tc.stop();
          harness.save(function (err) {
            console.log('------ Our Build is DONE and SAVED');
          });
        }
      });
    }
    harness.save(function (err) {
      console.log('------ Our Build is STARTED and SAVED');
    });
  });


  var masterVMList = [
    'docker1',
    'docker2',
    'docker3',
    'docker4',
    'docker5',
    'docker6',
    'docker7',
    'docker8',
    'docker9',
    'docker10'
  ]; // master list

  var tc = {ip: '192.168.1.1', fqdn: "super.klipfolio.com"};

  Vm.find({ name : { $in: masterVMList } }).exec(function (err, takenVmList) {
    if (err) {
      console.log("ERROR FINDING availableVmList")
    }
    else {
      var existing_vm_list = []
      takenVmList.forEach(function(item) {
        existing_vm_list.push(item.name);
      })
      console.log("existing_vms: " + existing_vm_list);
      var usable_vm_list = masterVMList.filter( function( el ) {
        return existing_vm_list.indexOf( el ) < 0;
      } );
      console.log("usable vms: " + usable_vm_list);

      if (usable_vm_list.length == 0) {
        // Nothing Free
        console.log("NO VMS ARE AVAILABLE");
      }
      else {
        var d = new Date;
        var expire = vm.expire ? dateAdd(d, 'minute', vm.expire) : dateAdd(d, 'minute', DEFAULT_EXPIRE_MIN);
        console.log("expire mins: " + vm.expire)
        console.log("VM ID: " + vm._id)
        vm.name = usable_vm_list[0]; // availableVm.vm_name
        harness.vm_name = usable_vm_list[0]; // availableVm.vm_name
        harness.vm_id = vm._id // availableVm.vm_name
        //vm.expire = vm.expire;
        vm.ip = tc.ip;  // availableVm.ip
        vm.fqdn = tc.fqdn; // availableVm.fqdn
        console.log("USING VM: " + vm.name)
        vm.save(function (err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            //res.json(vm);
          }
        });
        console.log("HARNESS SAVING");
        console.log(harness);
        harness.save(function (err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            tc.start();
            res.json(harness);
          }
        });
      }
    }
  });



};

/**
 * Show the current vm
 */
exports.read = function (req, res) {
  res.json(req.vm);
};

/**
 * Update a vm
 */
exports.update = function (req, res) {
  var vm = req.vm;

  vm.title = req.body.title;
  vm.content = req.body.content;

  vm.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(vm);
    }
  });
};

/**
 * Delete an vm
 */
exports.delete = function (req, res) {
  var vm = req.vm;

  vm.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(vm);
    }
  });
};

/**
 * List of Vms
 */
exports.list = function (req, res) {
  Vm.find().sort('-created').populate('user', 'displayName').exec(function (err, vms) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(vms);
    }
  });
};

/**
 * Vm middleware
 */
exports.vmByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Vm is invalid'
    });
  }

  Vm.findById(id).populate('user', 'displayName').exec(function (err, vm) {
    if (err) {
      return next(err);
    } else if (!vm) {
      return res.status(404).send({
        message: 'No vm with that identifier has been found'
      });
    }
    req.vm = vm;
    next();
  });
};
