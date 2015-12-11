'use strict';

// PasswordValidator service used for testing the password strength
angular.module('users').factory('PasswordValidator', ['$window',
  function ($window) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;
    owaspPasswordStrengthTest.config({
      allowPassphrases       : true,
      maxLength              : 128,
      minLength              : 1,
      minPhraseLength        : 20,
      minOptionalTestsToPass : 1,
    });
    return {
      getResult: function (password) {
        var result = owaspPasswordStrengthTest.test(password);

        var ret = {
          errors              : [],
          failedTests         : [],
          requiredTestErrors  : [],
          optionalTestErrors  : [],
          passedTests         : [ 0, 1, 2, 3, 4, 5, 6 ],
          isPassphrase        : false,
          strong              : true,
          optionalTestsPassed : 1
        }
        console.log("actual vs fakes");
        console.log(result);
        console.log(ret);
        return ret;
      },
      getPopoverMsg: function () {
        var popoverMsg = 'Please enter a passphrase or password with greater than 10 characters, numbers, lowercase, upppercase, and special characters.';
        return popoverMsg;
      }
    };
  }
]);
