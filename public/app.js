//Created by Muli on 09-May-16.
angular.module('app', [
    'ngAnimate',
    'ngTouch',
    'ui.bootstrap',
    'ui.router',
    'ngStorage',
    'oc.lazyLoad',
    'app.services'
])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', '$localStorageProvider', '$ocLazyLoadProvider', '$compileProvider', 'baseUrlProvider',
        function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $localStorageProvider, $ocLazyLoadProvider, $compileProvider, baseUrlProvider) {
            baseUrlProvider.set('https://meanbp.herokuapp.com');

            $compileProvider.debugInfoEnabled(false);

            $ocLazyLoadProvider.config({debug: true});
            $localStorageProvider.setKeyPrefix('app');

            $httpProvider.interceptors.push('jwtInterceptor');
            $httpProvider.interceptors.push('jwtResponseInterceptor');

            $urlRouterProvider.otherwise('/');

            function lazyLoad(dependencies) {
                return ['$ocLazyLoad', '$$animateJs', function ($ocLazyLoad) {
                    return $ocLazyLoad.load(dependencies);
                }];
            }

            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'components/statics/home.html'
                })

                .state('auth', {
                    abstract: true,
                    template: '<ui-view></ui-view>',
                    resolve: {
                        module: lazyLoad('components/auth/auth.min.js')
                    }
                })
                .state('auth.login', {
                    url: '/login',
                    controller: 'loginCtrl as vm',
                    templateUrl: 'components/auth/login.html',
                    resolve: {
                        user: ['$q', 'Auth', function ($q, Auth) {
                            var user = Auth.currentUser();
                            if (user) {
                                return $q.reject({redirect: 'profile'});
                            }
                        }]
                    }
                })
                .state('auth.signup', {
                    url: '/signup',
                    controller: 'signupCtrl as vm',
                    templateUrl: 'components/auth/signup.html'
                })
                .state('auth.reset', {
                    url: '/reset',
                    controller: 'resetPassCtrl as vm',
                    templateUrl: 'components/auth/reset.html'
                })

                .state('profile', {
                    url: '/profile',
                    controller: 'profileCtrl as vm',
                    templateUrl: 'components/profile/profile.html',
                    resolve: {
                        module: lazyLoad('components/profile/profile.min.js'),
                        user: ['$q', 'Auth', function ($q, Auth) {
                            var user = Auth.currentUser();
                            if (!user) {
                                return $q.reject({redirect: redirect});
                            }
                            return user.$promise;
                        }]
                    }
                });

            $locationProvider
                .html5Mode(true)
                .hashPrefix('!');
        }])
    .run(['$rootScope', '$state', function ($rootScope, $state) {
        $rootScope.$on('$stateChangeError', function (evt, to, toParams, from, fromParams, error) {
            if (error.redirect) {
                $state.go(error.redirect);
            } else {
                $state.go('error', {status: error.status})
            }
        })
    }]);

angular.module('app.components', []);