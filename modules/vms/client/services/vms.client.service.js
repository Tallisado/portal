'use strict';

//Vms service used for communicating with the vms REST endpoints
angular.module('vms').factory('Vms', ['$resource',
  function ($resource) {
    return $resource('api/vms/:vmId', {
      vmId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
