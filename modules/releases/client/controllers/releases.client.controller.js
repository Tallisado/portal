'use strict';

// Releases controller
angular.module('releases').controller('ReleasesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Releases',
  function ($scope, $stateParams, $location, Authentication, Releases) {
    $scope.authentication = Authentication;

    // Create new Release
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'releaseForm');
        return false;
      }

      // Create new Release object
      var release = new Releases({
        utrack_id: this.utrack_id
      });

      // Redirect after save
      release.$save(function (response) {
        $location.path('releases/' + response._id);

        // Clear form fields
        $scope.release_name = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Release
    $scope.remove = function (release) {
      if (release) {
        release.$remove();

        for (var i in $scope.releases) {
          if ($scope.releases[i] === release) {
            $scope.releases.splice(i, 1);
          }
        }
      } else {
        $scope.release.$remove(function () {
          $location.path('releases');
        });
      }
    };

    // Update existing Release
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'releaseForm');

        return false;
      }

      var release = $scope.release;

      release.$update(function () {
        $location.path('releases/' + release._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Releases
    $scope.find = function () {
      $scope.releases = Releases.query();
    };

    // Find existing Release
    $scope.findOne = function () {
      $scope.release = Releases.get({
        releaseId: $stateParams.releaseId
      });
    };
  }
])
.directive('capitalize', function() {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
           if(inputValue === undefined) inputValue = '';
           var capitalized = inputValue.toUpperCase();
           if(capitalized !== inputValue) {
              modelCtrl.$setViewValue(capitalized);
              modelCtrl.$render();
            }
            return capitalized;
         };
         modelCtrl.$parsers.push(capitalize);
         capitalize(scope[attrs.ngModel]);  // capitalize initial value
     }
   };
})
.filter('makeCaps',function(){

  return function(input){

   var capsInput = input.split(' '),
       newInput = [];

   angular.forEach(capsInput,function(val,index){
    newInput.push(val.substr(0,1).toUpperCase()+val.substr(1));
  });
    return newInput.join(' ');
  };

});
