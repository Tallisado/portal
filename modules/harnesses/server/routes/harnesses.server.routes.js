'use strict';

/**
 * Module dependencies.
*/
var harnessesPolicy = require('../policies/harnesses.server.policy'),
  harnesses = require('../controllers/harnesses.server.controller');

module.exports = function (app) {
  // Harnesses collection routes
  app.route('/api/harnesses').all(harnessesPolicy.isAllowed)
    .get(harnesses.list)
    .post(harnesses.create);

  // Single harness routes
  app.route('/api/harnesses/:harnessId').all(harnessesPolicy.isAllowed)
    .get(harnesses.read)
    .put(harnesses.update)
    .delete(harnesses.delete);

  // Finish by binding the harness middleware
  app.param('harnessId', harnesses.harnessByID);
};
