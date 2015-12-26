'use strict';

/**
 * Module dependencies.
*/
var vmsPolicy = require('../policies/vms.server.policy'),
  vms = require('../controllers/vms.server.controller');

module.exports = function (app) {
  // Vms collection routes
  app.route('/api/vms').all(vmsPolicy.isAllowed)
    .get(vms.list)
    .post(vms.create);

  // Single vm routes
  app.route('/api/vms/:vmId').all(vmsPolicy.isAllowed)
    .get(vms.read)
    .put(vms.update)
    .delete(vms.delete);

  // Finish by binding the vm middleware
  app.param('vmId', vms.vmByID);
};
