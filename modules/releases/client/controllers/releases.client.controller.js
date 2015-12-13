'use strict';

// Releases controller
angular.module('releases').controller('ReleasesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Releases',
  function ($scope, $stateParams, $location, Authentication, Releases) {
    $scope.authentication = Authentication;

    $scope.getRandomSpan = function(){
      return Math.floor((Math.random()*6)+1);
    }


    $scope.slackMessageCanary = function () {
      console.log('client slackMessage');
      var release = $scope.release;
      release.slack = "1";
      //console.log(release);

      release.$update(function () {
        console.log("BACK IN CLIENT");
        //$location.path('releases/' + response._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    $scope.slackMessageProduction = function () {
      console.log('client slackMessage');
      var release = $scope.release;
      release.slack = "2";
      //console.log(release);

      release.$update(function () {
        console.log("BACK IN CLIENT");
        //$location.path('releases/' + response._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Create new Release
    $scope.create = function (isValid) {
      $scope.error = null;

      console.log("create in client release")

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'releaseForm');
        return false;
      }

      // Create new Release object
      var release = new Releases({
        utrack_id1: this.utrack_id1,
        utrack_id2: this.utrack_id2,
        utrack_id3: this.utrack_id3,
        utrack_id4: this.utrack_id4,
        utrack_id5: this.utrack_id5
      });


      // Redirect after save
      release.$save(function (response) {
        console.log("save in client release")

        $location.path('releases/' + response._id);

        // Clear form fields
        $scope.release_name = '';
      }, function (errorResponse) {
        console.log("error in client release")
        console.log(errorResponse)

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
.filter('randomize', function() {
  return function(input, scope) {
    if (input!=null && input!=undefined && input > 1) {
      return Math.floor((Math.random()*input)+1);
    }
  }
});
