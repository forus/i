define('state/service/link/controller', ['angularAMD'], function (angularAMD) {
	angularAMD.controller('ServiceLinkController', ['$rootScope', function ($rootScope) {
		console.log('$rootScope');
    }]);
});
define('service.link', ['angularAMD'], function (angularAMD) {
    var app = angular.module('service.link', []);

    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('service.link', {
                url: '/link',
                views: {
                    '': angularAMD.route({
                        templateProvider: ['$templateCache', function($templateCache) {
							return $templateCache.get('html/service/link/index.html');
						}],
						controller: 'ServiceLinkController',
                        controllerUrl: 'state/service/link/controller'
                    })
                }
            })
    }]);
    return app;
});


define('state/service/built-in/controller', ['angularAMD'], function (angularAMD) {
	angularAMD.controller('ServiceBuiltInController', ['$state', '$rootScope', 'service', function ($state, $rootScope, service) {
		switch(service.range) {
			case 0:
				$state.go('service.built-in.default', {id: service.id}, { location: true });
				break;
			case 1:
				$state.go('service.built-in.region', {id: service.id}, { location: true });
				break;
		}
    }]);
});
define('state/service/built-in/default/controller', ['angularAMD'], function (angularAMD) {
	angularAMD.controller('ServiceBuiltInDefaultController', ['$rootScope', function ($rootScope) {
		console.log('$rootScope');
    }]);
});
define('service.built-in.default', ['angularAMD'], function (angularAMD) {
    var app = angular.module('service.built-in.default', []);

    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('service.built-in.default', {
                url: '/default',
                views: {
                    '': angularAMD.route({
                        templateProvider: ['$templateCache', function($templateCache) {
							return $templateCache.get('html/service/built-in/default/index.html');
						}],
						controller: 'ServiceBuiltInDefaultController',
                        controllerUrl: 'state/service/built-in/default/controller'
                    })
                }
            })
    }]);
    return app;
});


define('state/service/built-in/region/controller', ['angularAMD'], function (angularAMD) {
	angularAMD.controller('ServiceBuiltInRegionController', ['$rootScope', '$scope', 'regions', function ($rootScope, $scope, regions) {
		$scope.region = null;
		$scope.regions = regions;
    }]);
});
define('service.built-in.region', ['angularAMD'], function (angularAMD) {
    var app = angular.module('service.built-in.region', []);

    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('service.built-in.region', {
                url: '/region',
				resolve: {
					regions: ['$stateParams', 'ServiceService', function($stateParams, ServiceService) {
						return ServiceService.getRegions();
					}]
				},
                views: {
                    '': angularAMD.route({
                        templateProvider: ['$templateCache', function($templateCache) {
							return $templateCache.get('html/service/built-in/region/index.html');
						}],
						controller: 'ServiceBuiltInRegionController',
                        controllerUrl: 'state/service/built-in/region/controller'
                    })
                }
            })
    }]);
    return app;
});


define('service.built-in', ['angularAMD', 'service.built-in.default', 'service.built-in.region'], function (angularAMD) {
    var app = angular.module('service.built-in', []);

    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('service.built-in', {
                url: '/built-in',
                views: {
                    '': angularAMD.route({
                        templateProvider: ['$templateCache', function($templateCache) {
							return $templateCache.get('html/service/built-in/index.html');
						}],
						controller: 'ServiceBuiltInController',
                        controllerUrl: 'state/service/built-in/controller'
                    })
                }
            })
    }]);
    return app;
});


define('state/service/controller', ['angularAMD'], function (angularAMD) {
	angularAMD.controller('ServiceController', ['$state', '$rootScope', '$scope', 'service', function ($state, $rootScope, $scope, service) {
		$scope.service = service;
	}]);
});

define('state/service/general/controller', ['angularAMD'], function (angularAMD) {
	angularAMD.controller('ServiceGeneralController', ['$state', '$rootScope', '$scope', 'service', function ($state, $rootScope, $scope, service) {
		$scope.service = service;
		switch(service.serviceType.id) {
			case 1:
				$state.go('service.link', {id: service.id}, { location: true });
				break;
			case 4:
				$state.go('service.built-in', {id: service.id}, { location: true });
				break;
		}
    }]);
});
define('service/service', ['angularAMD'], function (angularAMD) {
	angularAMD.service('ServiceService', ['$http', function($http) {
		this.get = function(id) {
			var data = {
				'id': id
			};
			return $http.get('./api/service', {
				params: data,
				data: data
			}).then(function(response) {
				return response.data;
			});
		};
		this.getRegions = function() {
			return $http.get('./api/regions').then(function(response) {
				return response.data;
			});
		};
	}]);
});
define('service', ['angularAMD', 'service.link', 'service.built-in', 'service/service'], function (angularAMD) {
    var app = angular.module('service', []);

    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('service', {
				'abstract': true,
                url: '/service/{id:int}',
				resolve: {
					service: ['$stateParams', 'ServiceService', function($stateParams, ServiceService) {
						return ServiceService.get($stateParams.id);
					}]
				},
                views: {
                    '': angularAMD.route({
                        templateProvider: ['$templateCache', function($templateCache) {
							return $templateCache.get('html/service/index.html');
						}],
						controller: 'ServiceController',
                        controllerUrl: 'state/service/controller'
                    })
                }
            })
			.state('service.general', {
				url: '/general',
                views: {
                    '': angularAMD.route({
                        templateProvider: ['$templateCache', function($templateCache) {
							return $templateCache.get('html/service/general.html');
						}],
						controller: 'ServiceGeneralController',
                        controllerUrl: 'state/service/general/controller'
                    })
                }
			})
			.state('service.instruction', {
				url: '/instruction'
			})
			.state('service.legislation', {
				url: '/legislation'
			})
			.state('service.questions', {
				url: '/questions'
			})
			.state('service.discussion', {
				url: '/discussion'
			})
    }]);
    return app;
});

