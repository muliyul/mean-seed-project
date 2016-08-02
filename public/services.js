/**
 * Created by Muli Yulzary on 23-Jun-16.
 */
angular.module('app.services', [
    'ngResource',
    'ngStorage',
    'angular-jwt'
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
            return {
                get: function () {
                    return self.url;
                }
            };
        }]
    })
    .factory('API', ['$resource', 'baseUrl', function ($resource, baseUrl) {
        var UserResource = $resource(baseUrl.get() + '/api/users/:id', {id: '@_id'}, {
            login: {
                method: 'POST',
                url: baseUrl.get() + '/auth/login/:method',
                params: {
                    method: '@method'
                },
                cache: true
            },
            signup: {
                method: 'POST',
                url: baseUrl.get() + '/auth/signup',
                cache: true
            },
            resetPassword: {
                method: 'POST',
                url: baseUrl.get() + '/auth/reset'
            }
        });

        angular.extend(UserResource.prototype, {
            username: function () {
                return this.identities.local ? this.identities.local.username : null
            },
            firstName: function () {
                var facebook = this.identities.facebook, google = this.identities.google;
                return {
                    facebook: facebook ? facebook.first_name : null,
                    google: google ? google.first_name : null
                }
            },
            lastName: function () {
                var facebook = this.identities.facebook, google = this.identities.google;
                return {
                    facebook: facebook ? facebook.last_name : null,
                    google: google ? google.last_name : null
                }
            },
            picture: function () {
                var facebook = this.identities.facebook, google = this.identities.google;
                return {
                    facebook: facebook ? facebook.picture : null,
                    google: google ? google.picture : null
                }
            },
            email: function () {
                var facebook = this.identities.facebook, google = this.identities.google;
                return {
                    facebook: facebook ? facebook.email : null,
                    google: google ? google.email : null
                }
            },
            birthday: function () {
                var facebook = this.identities.facebook;
                return {
                    facebook: facebook ? facebook.birthday : null
                }
            }
        });

        return {
            User: UserResource
        };
    }])
    .service('Auth', ['$q', 'Token', 'API', function ($q, Token, API) {
        var self = this;
        self.user = null;

        this.login = function (loginData) {
            return API.User.login(loginData).$promise.then(function (user) {
                return self.user = user;
            });
        };

        this.signup = function (username, password) {
            return API.User.signup({
                username: username,
                password: password
            }).$promise.then(function (user) {
                return self.user = user;
            })
        };

        this.logout = function () {
            self.user = null;
            Token.clear();
        };

        this.currentUser = function () {
            if (!self.user && Token.get())
                self.user = API.User.get({id: Token.get().subject});
            return self.user;
        };

        return this;
    }])
    .service('Token', ['$localStorage', 'jwtHelper', function ($localStorage, jwtHelper) {
        var self = this;

        this.get = function (raw) {
            var token = $localStorage.token;
            if (raw)
                return token;
            try {
                return jwtHelper.decodeToken(token);
            } catch (e) {
            }
        };

        this.set = function (token) {
            $localStorage.token = token;
        };

        this.clear = function () {
            self.set();
        };

        return this;
    }])
    .factory('jwtResponseInterceptor', ['$q', 'Token', function ($q, Token) {
        return {
            response: function (response) {
                try {
                    var token = response.headers('Authorization').split(' ')[1];
                    if (token)
                        Token.set(token);
                } catch (e) {
                }
                return response;
            },
            responseError: function (rejection) {
                switch (rejection.status) {
                    case 401:
                        // Deauthenticate the global user
                        console.warn(401);
                        Token.clear();
                        //Auth.logout();
                        break;
                    case 403:
                        // Add unauthorized behaviour
                        console.warn(403);
                        break;
                }
                return $q.reject(rejection);
            }
        };
    }])
    .config(['$httpProvider', 'jwtInterceptorProvider', function ($httpProvider, jwtInterceptorProvider) {
        jwtInterceptorProvider.tokenGetter = ['config', 'Token', function (config, Token) {
            // Skip authentication for any requests ending in .html
            if (config.url.substr(config.url.length - 5) == '.html') {
                return null;
            }

            return Token.get(true);
        }];
    }]);