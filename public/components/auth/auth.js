/**
 * Created by muliyul on 02-Aug-16.
 */
angular.module('app.components.auth', [
    'app.services',
    {
        files: [
            'https://connect.facebook.net/en_us/sdk.js',
            'libs/ng-facebook/ngFacebook.js',
            'libs/ng-google-signin/dist/ng-google-signin.js',
            'components/auth/login.min.js',
            'components/auth/signup.min.js',
            'components/auth/reset.min.js'
        ],
        serie: true
    }
]);