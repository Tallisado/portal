'use strict';

describe('Vms E2E Tests:', function () {
  describe('Test vms page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3000/vms');
      expect(element.all(by.repeater('vm in vms')).count()).toEqual(0);
    });
  });
});
