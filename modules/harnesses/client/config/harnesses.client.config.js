'use strict';

// Configuring the Harnesses module
angular.module('harnesses').run(['Menus',
  function (Menus) {
    // Add the harnesses dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Harnesses',
      state: 'harnesses',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'harnesses', {
      title: 'List Harnesses',
      state: 'harnesses.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'harnesses', {
      title: 'Create Harnesses',
      state: 'harnesses.create',
      roles: ['user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'harnesses', {
      title: 'Capability',
      state: 'harnesses.capability',
      roles: ['user']
    });
  }
]);
