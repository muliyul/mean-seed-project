//Created by Muli on 09-May-16.
angular.module('app', [
    'ui.router',
    'oc.lazyLoad',
    'app.services'
])
    .provider('baseUrl', function baseUrlProvider() {
        var self = this;

        this.url = window.location.origin;

        this.set = function (url) {
            this.url = url;
        };

        this.get = function () {
            return self.url;
        };

        this.$get = [function () {
            return new baseUrlProvider();
        }]
    })
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', '$sessionStorageProvider',
        function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $sessionStorageProvider) {
            $sessionStorageProvider.setKeyPrefix('app');

            $urlRouterProvider.otherwise('/');
            $httpProvider.interceptors.push('jwtInterceptor');

            function lazyLoad(dependencies) {
                return ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load(dependencies);
                }];
            }

            function makeState(opts) {
                if (!opts.name)
                    throw Error('State name can\'t be empty!');

                var resolve = {
                    module: opts.controller ? lazyLoad('components/' + opts.name + '/' + opts.name + '.min.js') : undefined
                };

                if (opts.resolve)
                    angular.merge(resolve, opts.resolve);

                return {
                    url: opts.url ? opts.url : '/' + opts.name,
                    templateUrl: opts.templateUrl ? opts.templateUrl : 'components/' + opts.name + '/' + opts.name + '.html',
                    controller: opts.controller ? opts.name + 'Ctrl as vm' : undefined,
                    resolve: resolve
                }
            }

            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'components/home/home.html'
                })
                .state('login', makeState({
                    name: 'login',
                    controller: true
                }))
                .state('profile', makeState({
                    name: 'profile',
                    controller: true,
                    resolve: {
                        user: ['$state', '$q', 'Auth', function ($state, $q, Auth) {
                            var user = Auth.currentUser();
                            if (!user) {
                                return $q.reject().catch(function () {
                                    $state.go('home');
                                })
                            } else
                                return user;
                        }]
                    }
                }))
                .state('signup', makeState({
                    name: 'signup',
                    controller: true
                }));

            $locationProvider
                .html5Mode(true)
                .hashPrefix('!');
        }])
    .run(['$rootScope', function ($rootScope) {

    }]);

angular.module('app.components', []);