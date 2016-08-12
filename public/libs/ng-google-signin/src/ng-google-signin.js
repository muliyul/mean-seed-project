/**
 * google-signin module
 */
angular.module('google-signin', []).

/**
 * GooglePlus provider
 */provider('GoogleSignin', [function () {

    /**
     * Options object available for module
     * options/services definition.
     * @type {Object}
     */
    var options = {};

    /**
     * Sets the client id.
     * @param {string} clientId the client id
     * @returns {*} a chainable reference
     */
    this.setClientId = function (clientId) {
      options.client_id = clientId;
      return this;
    };

    /**
     * Gets the client id.
     * @returns {string|*|undefined} the client id
     */
    this.getClientId = function () {
      return options.client_id;
    };

    /**
     * Sets the cookie policy
     * @param {string} cookiePolicy the cookiepolicy
     * @returns {*} a chainable reference
     */
    this.setCookiePolicy = function (cookiePolicy) {
      options.cookie_policiy = cookiePolicy;
      return this;
    };

    /**
     * Gets the cookie policy
     * @returns {string|*|undefined} the cookie policy
     */
    this.getCookiePolicy = function () {
      return options.cookie_policiy;
    };

    /**
     * Sets the basic profile
     * @param {string} fetchBasicProfile the fetch basic profile option
     * @returns {*} a chainable reference
     */
    this.setFetchBasicProfile = function (fetchBasicProfile) {
      options.fetch_basic_profile = fetchBasicProfile;
      return this;
    };

    /**
     * Gets the fetch basic profile option
     * @returns {string|*|undefined} the fetch basic profile option
     */
    this.getFetchBasicProfile = function () {
      return options.fetch_basic_profile;
    };

    /**
     * Sets the hosted domain
     * @param {string} hostedDomain the hosted domain
     * @returns {*} a chainable reference
     */
    this.setHostedDomain = function (hostedDomain) {
      options.hosted_domain = hostedDomain;
      return this;
    };

    /**
     * Gets the hosted domain
     * @returns {string|*|undefined} the hosted domain
     */
    this.getHostedDomain = function () {
      return options.hosted_domain;
    };

    /**
     * Sets the OpenID Realm
     * @param {string} openIDRealm the OpenID realm to set
     * @returns {*} a chainable reference
     */
    this.setOpenIDRealm = function (openIDRealm) {
      options.openid_realm = openIDRealm;
      return this;
    };

    /**
     * Gets the OpenID Realm
     * @returns {string|*|undefined} the OpenID Realm
     */
    this.getOpenIDRealm = function () {
      return options.openid_realm;
    };

    /**
     * Scopes
     * @default ['profile', 'email']
     */
    options.scopes = ['profile', 'email'];

    /**
     * Sets current scopes
     * @param {string[]} scopes the scope to set
     * @returns {*} a chainable reference
     */
    this.setScopes = function (scopes) {
      options.scopes = scopes;
      return this;
    };

    /**
     * Gets the current scopes
     * @returns {Array|*|Boolean} the scopes array
     */
    this.getScopes = function () {
      return options.scopes;
    };

    /**
     * Init Google Plus API
     */
    this.init = function (customOptions) {
      angular.extend(options, customOptions);
    };

    /**
     * This defines the Google SignIn Service on run.
     */
    this.$get = ['$rootScope', '$q', function ($rootScope, $q) {
      var auth2;

      /**
       * NgGoogle Class
       * Wraps most of the functionality of the Google Sign-In JavaScript
       * SDK found at
       * https://developers.google.com/identity/sign-in/web/reference
       * @type {Class}
       */
      var NgGoogle = function () {
      };

      /**
       * Signs in the current user to the app.
       * See {@link https://developers.google.com/identity/sign-in/web/reference#googleauthsignin Google Reference} for more details.
       * @param {} [loginOptions] the options to configure login with
       * @returns {Function|promise}
       */
      NgGoogle.prototype.signIn = function (loginOptions) {
        return _wrapInAngularPromise(auth2.signIn(loginOptions));

      };

      /**
       * Signs out the current user from the app.
       * See {@link https://developers.google.com/identity/sign-in/web/reference#googleauthsignout Google Reference} for more details.
       * @returns {Function|promise} Fulfilled when the user has been signed
       * out.
       */
      NgGoogle.prototype.signOut = function () {
        return _wrapInAngularPromise(auth2.signOut());

      };

      /**
       * Prompts the user to grant offline access for the app.
       * See {@link https://developers.google.com/identity/sign-in/web/reference#googleauthgrantofflineaccesswzxhzdk74optionswzxhzdk75 Google Reference} for more details.
       * @param {} [options] the options to confgiure offline access with
       * @returns {Function|promise}
       */
      NgGoogle.prototype.grantOfflineAccess = function (options) {
        return _wrapInAngularPromise(auth2.grantOfflineAccess(options));
      };

      /**
       * Returns the user's sign in status.
       * See {@link https://developers.google.com/identity/sign-in/web/reference#googleauthissignedinget Google Reference} for more details.
       * @returns {boolean}
       */
      NgGoogle.prototype.isSignedIn = function () {
        return auth2.isSignedIn.get();
      };

      /**
       * Gets the current user.
       * See {@link https://developers.google.com/identity/sign-in/web/reference#googleauthcurrentuserget Google Reference} for more details.
       * @returns {*} GoogleUser object
       */
      NgGoogle.prototype.getUser = function () {
        return auth2.currentUser.get();
      };

      /**
       * Gets the basic profile for the current user.
       * See {@link https://developers.google.com/identity/sign-in/web/reference#googleusergetbasicprofile Google Reference} for more details.
       * @returns {*} GoogleUser profile
       */
      NgGoogle.prototype.getBasicProfile = function () {
        var currentUser = this.getUser().getBasicProfile();

        var profile = null;

        if (currentUser) {
          profile = {
            id:    currentUser.getId(),
            name:  currentUser.getName(),
            image: currentUser.getImageUrl(),
            email: currentUser.getEmail()
          };
        }

        return profile;
      };

      /**
       * Disconnects the current user from the app.
       * See {@link https://developers.google.com/identity/sign-in/web/reference#googleauthdisconnect Google Reference} for more details.
       */
      NgGoogle.prototype.disconnect = function () {
        auth2.disconnect();
      };

      /**
       * This callback handles the onload callback for the GAPI lib
       * @private
       */
      NgGoogle.prototype._loadCallback = function () {
        gapi.load('auth2', _initializeOnLoad);
      };

      return new NgGoogle();

      /**
       * Initialization callback called after GAPI is loaded.
       * @private
       */
      function _initializeOnLoad() {
        auth2 = gapi.auth2.init(options);

        auth2.currentUser.listen(function (user) {
          $rootScope.$broadcast('ng-google-signin:currentUser', user);
          $rootScope.$apply();
        });

        auth2.isSignedIn.listen(function (isSignedIn) {
          $rootScope.$broadcast('ng-google-signin:isSignedIn', isSignedIn);
          $rootScope.$apply();
        });
      }

      /**
       * Wraps a googleThenable into an Angular promise
       * @param googleThenable the googleThenable
       * @returns {Function|promise} the $q promise
       * @private
       */
      function _wrapInAngularPromise(googleThenable) {
        var deferred = $q.defer();

        googleThenable.then(deferred.resolve, deferred.reject);

        return deferred.promise;
      }
    }];
  }])

  // Initialization of module
  .run(['$window', 'GoogleSignin', function ($window, GoogleSignin) {
    // This needs to be on the window for the callback
    $window._startGoogleSignin = GoogleSignin._loadCallback;

    var po = document.createElement('script');
    po.type = 'text/javascript';
    po.async = true;
    po.src =
      'https://apis.google.com/js/client:platform.js?onload=_startGoogleSignin';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);
  }]);
