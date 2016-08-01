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
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', '$localStorageProvider',
        function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $localStorageProvider) {
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
                //<editor-fold desc="Secure states">
                .state('auth', {
                    url: '/auth',
                    abstract: true,
                    template: '<ui-view></ui-view>'
                })
                .state('auth.login', {
                    url: '/login',
                    controller: 'loginCtrl as vm',
                    templateUrl: 'components/auth/login.html',
                    resolve: {
                        module: lazyLoad('components/auth/login.min.js')
                    }
                })
                .state('auth.signup', {
                    url: '/signup',
                    controller: 'signupCtrl as vm',
                    templateUrl: 'components/auth/signup.html',
                    resolve: {
                        module: lazyLoad('components/auth/signup.min.js')
                    }
                })
                .state('auth.reset', {
                    url: '/reset',
                    controller: 'resetPassCtrl as vm',
                    templateUrl: 'components/auth/reset.html',
                    resolve: {
                        module: lazyLoad('components/auth/reset.min.js')
                    }
                })
                //</editor-fold>
                .state('profile', {
                    url: '/profile',
                    controller: 'profileCtrl as vm',
                    templateUrl: 'components/profile/profile.html',
                    resolve: {
                        module: lazyLoad('components/profile/profile.min.js'),
                        user: ['$state', '$q', 'Auth', function ($state, $q, Auth) {
                            var user = Auth.currentUser();
                            if (!user) {
                                $state.go('home');
                                return $q.reject();
                            } else
                                return user;
                        }]
                    }
                })
            ;

            $locationProvider
                .html5Mode(true)
                .hashPrefix('!');
        }])
    .run(['$rootScope', function ($rootScope) {

    }]);

angular.module('app.components', []);