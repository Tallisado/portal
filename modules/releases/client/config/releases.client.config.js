'use strict';

// Configuring the Releases module
angular.module('releases').run(['Menus',
  function (Menus) {
    // Add the releases dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Releases',
      state: 'releases',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'releases', {
      title: 'List Releases',
      state: 'releases.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'releases', {
      title: 'Create Releases',
      state: 'releases.create',
      roles: ['user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'releases', {
      title: 'Capability',
      state: 'releases.capability',
      roles: ['user']
    });
  }
]);
