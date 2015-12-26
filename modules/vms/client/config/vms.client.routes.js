'use strict';

// Setting up route
angular.module('vms').config(['$stateProvider',
  function ($stateProvider) {
    // Vms state routing
    $stateProvider
      .state('vms', {
        abstract: true,
        url: '/vms',
        template: '<ui-view/>'
      })
      .state('vms.list', {
        url: '',
        templateUrl: 'modules/vms/client/views/list-vms.client.view.html'
      })
      .state('vms.create', {
        url: '/create',
        templateUrl: 'modules/vms/client/views/create-vm.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('vms.view', {
        url: '/:vmId',
        templateUrl: 'modules/vms/client/views/view-vm.client.view.html'
      })
      .state('vms.capability', {
        url: '/capability',
        templateUrl: 'modules/vms/client/views/capability.view.html'
      })
      .state('vms.edit', {
        url: '/:vmId/edit',
        templateUrl: 'modules/vms/client/views/edit-vm.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
