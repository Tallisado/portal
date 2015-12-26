'use strict';

describe('Harnesses E2E Tests:', function () {
  describe('Test harnesses page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3000/harnesses');
      expect(element.all(by.repeater('harness in harnesses')).count()).toEqual(0);
    });
  });
});
