'use strict';

// Setting up route
angular.module('harnesses').config(['$stateProvider',
  function ($stateProvider) {
    // Harnesses state routing
    $stateProvider
      .state('harnesses', {
        abstract: true,
        url: '/harnesses',
        template: '<ui-view/>'
      })
      .state('harnesses.list', {
        url: '',
        templateUrl: 'modules/harnesses/client/views/list-harnesses.client.view.html'
      })
      .state('harnesses.create', {
        url: '/create',
        templateUrl: 'modules/harnesses/client/views/create-harness.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('harnesses.view', {
        url: '/:harnessId',
        templateUrl: 'modules/harnesses/client/views/view-harness.client.view.html'
      })
      .state('harnesses.capability', {
        url: '/capability',
        templateUrl: 'modules/harnesses/client/views/capability.view.html'
      })
      .state('harnesses.edit', {
        url: '/:harnessId/edit',
        templateUrl: 'modules/harnesses/client/views/edit-harness.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
