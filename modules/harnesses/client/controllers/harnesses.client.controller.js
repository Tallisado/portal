'use strict';

// Harnesses controller
angular.module('harnesses').controller('HarnessesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Harnesses', 'Vms',
  function ($scope, $stateParams, $location, Authentication, Harnesses, Vms) {
    $scope.authentication = Authentication;

    $scope.disable_tests = true;

    $scope.branch_list = { webui: { pegged: 'develop', branch:"" },
                  dc: { pegged: 'develop', name: 'dc', branch:"" },
                  df: { pegged: 'develop', name: 'dc', branch:"" },
                  ee: { pegged: 'develop', name: 'dc', branch:"" },
                  wu: { pegged: 'develop', name: 'dc', branch:"" },
                  dp: { pegged: 'develop', name: 'dc', branch:"" },
                  rf: { pegged: 'develop', name: 'dc', branch:"" },

    }

    $scope.data = {
      testmode : {
        mask: 0,      // TODO: we can mask toggle the assortment if test modes later
        name: 'None'
      },
      testresults : { webui: { p: 0, f: 0 }, dc: { p: 0, f: 0 } }
    }

    $scope.test_modes = [
      'None',
      'Unit Testing',
      'API Testing',
      'System Testing',
      'Web Testing',
      'Full Testing'
    ];

    $scope.vm_names = [
      'docker1',
      'docker2',
      'docker3',
      'docker4',
      'docker5',
      'docker6',
      'docker7',
      'docker8',
      'docker9',
      'docker10'
    ];

    $scope.today = function() {
        $scope.expire = new Date();
    };
    $scope.today();

    $scope.clear = function () {
      $scope.expire = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();
    $scope.maxDate = new Date(2020, 5, 22);

    $scope.open = function($event) {
      $scope.status.opened = true;
    };

    $scope.setDate = function(year, month, day) {
      $scope.expire = new Date(year, month, day);
    };

    $scope.toggleOneDay = function() {
      $scope.expire = new Date().setDate(new Date().getDate() + 1);
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.status = {
      opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 2);
    $scope.events =
      [
        {
          date: tomorrow,
          status: 'full'
        },
        {
          date: afterTomorrow,
          status: 'partially'
        }
      ];

    $scope.getDayClass = function(date, mode) {
      if (mode === 'day') {
        var dayToCheck = new Date(date).setHours(0,0,0,0);

        for (var i=0;i<$scope.events.length;i++){
          var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

          if (dayToCheck === currentDay) {
            return $scope.events[i].status;
          }
        }
      }

      return '';
    };

    $scope.status = {
      isopen: false
    };

    $scope.toggled = function(open) {
      $log.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };

    // Create new Harness
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'harnessForm');
        return false;
      }

      // Create new Harness object
      var harness = new Harnesses({
        vm_name: this.vm_name,

        data: $scope.data
        // tc_build_id: this.tc_build_id   (ADDED BY REFRESH)
      });


      // Create new Vm object
      var vm = new Vms({
        vm_name: this.vm_name,
        expire: this.expire,
        branches: $scope.branch_list,
        data: $scope.data,
        // owner: this.owner,
        force: false,
        loaded: false
      });

      // // Redirect after save
      // harness.$save(function (response) {
      //   // $location.path('vms/' + response._id);
      //   //
      //   // // Clear form fields
      //   // $scope.vm_name = '';
      // }, function (errorResponse) {
      //   $scope.error = errorResponse.data.message;
      // });
      console.log("saving")
      // Redirect after save
      vm.$save(function (response) {
        $location.path('harnesses/' + response._id);
        //
        // // Clear form fields
        // $scope.vm_name = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });


      // Redirect after save

    };

    // Remove existing Harness
    $scope.remove = function (harness) {
      if (harness) {
        harness.$remove();

        for (var i in $scope.harnesses) {
          if ($scope.harnesses[i] === harness) {
            $scope.harnesses.splice(i, 1);
          }
        }
      } else {
        $scope.harness.$remove(function () {
          $location.path('harnesses');
        });
      }
    };

    // Update existing Harness
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'harnessForm');

        return false;
      }

      var harness = $scope.harness;

      harness.$update(function () {
        $location.path('harnesses/' + harness._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Harnesses
    $scope.find = function () {
      $scope.harnesses = Harnesses.query();
    };

    // Find existing Harness
    $scope.findOne = function () {
      $scope.harness = Harnesses.get({
        harnessId: $stateParams.harnessId
      });
    };

    // Find existing Harness
    $scope.refreshingFindOne = function () {
      $scope.harness = Harnesses.get({
        harnessId: $stateParams.harnessId
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
