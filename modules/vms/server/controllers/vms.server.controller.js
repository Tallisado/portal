'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Vm = mongoose.model('Vm'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var Client =  require('node-rest-client').Client;

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
exports.create = function (req, res) {
  var vm = new Vm(req.body);
  vm.user = req.user;


  // need tc data call here
  // URLLIB CODE HERE
  console.log("[server] triggering urllib on vm creation");
  console.log("[server] ASKING TC FOR DATA (FAKE)");
  var tc = {ip: '192.168.1.1', fqdn: "super.klipfolio.com"};

  if (vm.vm_name && vm.force) {
    console.log('BLOW AWAY VM AND REUSE')
  } else {
    var full_vm_list = ['docker1', 'docker2', 'docker3', 'docker4', 'docker5', 'docker6', 'docker7', 'docker8', 'docker9', 'docker10']; // master list
    Vm.find({ vm_name: { $in: full_vm_list } }).exec(function (err, vms) {
      if (err) {
        console.log("ERROR")
      }
      else {
        var existing_vm_list = []
        vms.forEach(function(item) {
          existing_vm_list.push(item.vm_name);
        })
        console.log("existing_vms: " + existing_vm_list);
        var usable_vm_list = full_vm_list.filter( function( el ) {
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
          vm.vm_name = usable_vm_list[0];
          vm.expire = expire;
          vm.ip = tc.ip;
          vm.fqdn = tc.fqdn;
          console.log("USING VM: " + vm.vm_name)
          vm.save(function (err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.json(vm);
            }
          });
        }
      }
    });
  }



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
