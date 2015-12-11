'use strict';

//Releases service used for communicating with the releases REST endpoints
angular.module('releases').factory('Releases', ['$resource',
  function ($resource) {
    return $resource('api/releases/:releaseId', {
      releaseId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
