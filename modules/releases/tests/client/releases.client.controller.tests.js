'use strict';

(function () {
  // Releases Controller Spec
  describe('Releases Controller Tests', function () {
    // Initialize global variables
    var ReleasesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Releases,
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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Releases_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Releases = _Releases_;

      // create mock release
      mockArticle = new Releases({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Release about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Releases controller.
      ReleasesController = $controller('ReleasesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one release object fetched from XHR', inject(function (Releases) {
      // Create a sample releases array that includes the new release
      var sampleReleases = [mockArticle];

      // Set GET response
      $httpBackend.expectGET('api/releases').respond(sampleReleases);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.releases).toEqualData(sampleReleases);
    }));

    it('$scope.findOne() should create an array with one release object fetched from XHR using a releaseId URL parameter', inject(function (Releases) {
      // Set the URL parameter
      $stateParams.releaseId = mockArticle._id;

      // Set GET response
      $httpBackend.expectGET(/api\/releases\/([0-9a-fA-F]{24})$/).respond(mockArticle);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.release).toEqualData(mockArticle);
    }));

    describe('$scope.create()', function () {
      var sampleArticlePostData;

      beforeEach(function () {
        // Create a sample release object
        sampleArticlePostData = new Releases({
          title: 'An Release about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Release about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Releases) {
        // Set POST response
        $httpBackend.expectPOST('api/releases', sampleArticlePostData).respond(mockArticle);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the release was created
        expect($location.path.calls.mostRecent().args[0]).toBe('releases/' + mockArticle._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/releases', sampleArticlePostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock release in scope
        scope.release = mockArticle;
      });

      it('should update a valid release', inject(function (Releases) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/releases\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/releases/' + mockArticle._id);
      }));

      it('should set scope.error to error response message', inject(function (Releases) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/releases\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(release)', function () {
      beforeEach(function () {
        // Create new releases array and include the release
        scope.releases = [mockArticle, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/releases\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockArticle);
      });

      it('should send a DELETE request with a valid releaseId and remove the release from the scope', inject(function (Releases) {
        expect(scope.releases.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.release = mockArticle;

        $httpBackend.expectDELETE(/api\/releases\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to releases', function () {
        expect($location.path).toHaveBeenCalledWith('releases');
      });
    });
  });
}());
