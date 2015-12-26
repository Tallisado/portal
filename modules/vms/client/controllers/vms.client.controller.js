'use strict';

// Vms controller
angular.module('vms').controller('VmsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Vms',
  function ($scope, $stateParams, $location, Authentication, Vms) {
    $scope.authentication = Authentication;



    $scope.today = function() {
        $scope.dt = new Date();
      };
      $scope.today();

      $scope.clear = function () {
        $scope.dt = null;
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
        $scope.dt = new Date(year, month, day);
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





  $scope.test_modes = [
    'None',
    'Unit Testing',
    'API Testing',
    'System Testing',
    'Web Testing',
    'Full Testing'
  ];


  $scope.items = [
    'The first choice!',
    'And another choice for you.',
    'but wait! A third!'
  ];

  $scope.status = {
    isopen: false
  };

  $scope.toggled = function(open) {
    console.log('Dropdown is now: ', open);
  };

  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };







    // Create new Vm
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vmForm');

        return false;
      }

      // Create new Vm object
      var vm = new Vms({
        vm_name: this.vm_name,
        expire: null,
        owner: this.owner,
        force: this.force,
        loaded: this.loaded
      });

      // Redirect after save
      vm.$save(function (response) {
        $location.path('vms/' + response._id);

        // Clear form fields
        $scope.vm_name = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Vm
    $scope.remove = function (vm) {
      if (vm) {
        vm.$remove();

        for (var i in $scope.vms) {
          if ($scope.vms[i] === vm) {
            $scope.vms.splice(i, 1);
          }
        }
      } else {
        $scope.vm.$remove(function () {
          $location.path('vms');
        });
      }
    };

    // Update existing Vm
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vmForm');

        return false;
      }

      var vm = $scope.vm;

      vm.$update(function () {
        $location.path('vms/' + vm._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Vms
    $scope.find = function () {
      $scope.vms = Vms.query();
    };

    // Find existing Vm
    $scope.findOne = function () {
      $scope.vm = Vms.get({
        vmId: $stateParams.vmId
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
