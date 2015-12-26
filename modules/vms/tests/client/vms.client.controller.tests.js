'use strict';

(function () {
  // Vms Controller Spec
  describe('Vms Controller Tests', function () {
    // Initialize global variables
    var VmsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Vms,
      mockArticle;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Vms_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Vms = _Vms_;

      // create mock vm
      mockArticle = new Vms({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Vm about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Vms controller.
      VmsController = $controller('VmsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one vm object fetched from XHR', inject(function (Vms) {
      // Create a sample vms array that includes the new vm
      var sampleVms = [mockArticle];

      // Set GET response
      $httpBackend.expectGET('api/vms').respond(sampleVms);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.vms).toEqualData(sampleVms);
    }));

    it('$scope.findOne() should create an array with one vm object fetched from XHR using a vmId URL parameter', inject(function (Vms) {
      // Set the URL parameter
      $stateParams.vmId = mockArticle._id;

      // Set GET response
      $httpBackend.expectGET(/api\/vms\/([0-9a-fA-F]{24})$/).respond(mockArticle);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.vm).toEqualData(mockArticle);
    }));

    describe('$scope.create()', function () {
      var sampleArticlePostData;

      beforeEach(function () {
        // Create a sample vm object
        sampleArticlePostData = new Vms({
          title: 'An Vm about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Vm about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Vms) {
        // Set POST response
        $httpBackend.expectPOST('api/vms', sampleArticlePostData).respond(mockArticle);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the vm was created
        expect($location.path.calls.mostRecent().args[0]).toBe('vms/' + mockArticle._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/vms', sampleArticlePostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock vm in scope
        scope.vm = mockArticle;
      });

      it('should update a valid vm', inject(function (Vms) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/vms\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/vms/' + mockArticle._id);
      }));

      it('should set scope.error to error response message', inject(function (Vms) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/vms\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(vm)', function () {
      beforeEach(function () {
        // Create new vms array and include the vm
        scope.vms = [mockArticle, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/vms\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockArticle);
      });

      it('should send a DELETE request with a valid vmId and remove the vm from the scope', inject(function (Vms) {
        expect(scope.vms.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.vm = mockArticle;

        $httpBackend.expectDELETE(/api\/vms\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to vms', function () {
        expect($location.path).toHaveBeenCalledWith('vms');
      });
    });
  });
}());
