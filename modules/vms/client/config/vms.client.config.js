'use strict';

// Configuring the Vms module
angular.module('vms').run(['Menus',
  function (Menus) {
    // Add the vms dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Vms',
      state: 'vms',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'vms', {
      title: 'List Vms',
      state: 'vms.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'vms', {
      title: 'Create Vms',
      state: 'vms.create',
      roles: ['user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'vms', {
      title: 'Capability',
      state: 'vms.capability',
      roles: ['user']
    });
  }
]);
