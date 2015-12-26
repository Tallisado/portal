'use strict';

(function () {
  // Harnesses Controller Spec
  describe('Harnesses Controller Tests', function () {
    // Initialize global variables
    var HarnessesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Harnesses,
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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Harnesses_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Harnesses = _Harnesses_;

      // create mock harness
      mockArticle = new Harnesses({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Harness about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Harnesses controller.
      HarnessesController = $controller('HarnessesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one harness object fetched from XHR', inject(function (Harnesses) {
      // Create a sample harnesses array that includes the new harness
      var sampleHarnesses = [mockArticle];

      // Set GET response
      $httpBackend.expectGET('api/harnesses').respond(sampleHarnesses);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.harnesses).toEqualData(sampleHarnesses);
    }));

    it('$scope.findOne() should create an array with one harness object fetched from XHR using a harnessId URL parameter', inject(function (Harnesses) {
      // Set the URL parameter
      $stateParams.harnessId = mockArticle._id;

      // Set GET response
      $httpBackend.expectGET(/api\/harnesses\/([0-9a-fA-F]{24})$/).respond(mockArticle);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.harness).toEqualData(mockArticle);
    }));

    describe('$scope.create()', function () {
      var sampleArticlePostData;

      beforeEach(function () {
        // Create a sample harness object
        sampleArticlePostData = new Harnesses({
          title: 'An Harness about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Harness about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Harnesses) {
        // Set POST response
        $httpBackend.expectPOST('api/harnesses', sampleArticlePostData).respond(mockArticle);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the harness was created
        expect($location.path.calls.mostRecent().args[0]).toBe('harnesses/' + mockArticle._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/harnesses', sampleArticlePostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock harness in scope
        scope.harness = mockArticle;
      });

      it('should update a valid harness', inject(function (Harnesses) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/harnesses\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/harnesses/' + mockArticle._id);
      }));

      it('should set scope.error to error response message', inject(function (Harnesses) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/harnesses\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(harness)', function () {
      beforeEach(function () {
        // Create new harnesses array and include the harness
        scope.harnesses = [mockArticle, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/harnesses\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockArticle);
      });

      it('should send a DELETE request with a valid harnessId and remove the harness from the scope', inject(function (Harnesses) {
        expect(scope.harnesses.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.harness = mockArticle;

        $httpBackend.expectDELETE(/api\/harnesses\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to harnesses', function () {
        expect($location.path).toHaveBeenCalledWith('harnesses');
      });
    });
  });
}());
