'use strict';

//Harnesses service used for communicating with the harnesses REST endpoints
angular.module('harnesses').factory('Harnesses', ['$resource',
  function ($resource) {
    return $resource('api/harnesses/:harnessId', {
      harnessId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
