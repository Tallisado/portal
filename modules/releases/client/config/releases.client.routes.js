'use strict';

// Setting up route
angular.module('releases').config(['$stateProvider',
  function ($stateProvider) {
    // Releases state routing
    $stateProvider
      .state('releases', {
        abstract: true,
        url: '/releases',
        template: '<ui-view/>'
      })
      .state('releases.list', {
        url: '',
        templateUrl: 'modules/releases/client/views/list-releases.client.view.html'
      })
      .state('releases.create', {
        url: '/create',
        templateUrl: 'modules/releases/client/views/create-release.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('releases.view', {
        url: '/:releaseId',
        templateUrl: 'modules/releases/client/views/view-release.client.view.html'
      })
      .state('releases.capability', {
        url: '/capability',
        templateUrl: 'modules/releases/client/views/capability.view.html'
      })
      .state('releases.edit', {
        url: '/:releaseId/edit',
        templateUrl: 'modules/releases/client/views/edit-release.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
