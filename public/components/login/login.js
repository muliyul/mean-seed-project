/**
 * Created by Muli Yulzary on 23-Jun-16.
 */
angular.module('app.components.login', ['ngFacebook', 'google-signin', [
    'https://connect.facebook.net/en_us/sdk.js',
    'libs/ng-facebook/ngFacebook.js',
    'libs/ng-google-signin/dist/ng-google-signin.min.js'
]])
    .config(['$facebookProvider', 'GoogleSigninProvider', function ($facebookProvider, GoogleSigninProvider) {
        $facebookProvider.setPermissions('email');
        $facebookProvider.setCustomInit({
            appId: '145922565834003',
            version: 'v2.7',
            channel: '',
            xfbml: true
        });

        GoogleSigninProvider.init({
            client_id: '318323838412-n0oj6d720s78aev3gbc404k76lcjupbg.apps.googleusercontent.com'
        })
    }])
    .run(['$facebook', function ($facebook) {
        $facebook.init()
    }])
    .controller('loginCtrl', ['$state', '$facebook', 'GoogleSignin', 'Auth',
                    function ($state, $facebook, GoogleSignin, Auth) {
        var vm = this;

        vm.login = function (provider) {
            switch (provider) {
                case 'facebook':
                    $facebook.login('email').then(function () {
                        return $facebook.api('/me?fields=id,first_name,last_name,birthday,email')
                    }).then(function (data) {
                        var authObj = {
                            id: data.id,
                            data: data,
                            method: provider
                        };
                        return Auth.login(authObj);
                    }).then(function () {
                        $state.go('profile');
                    }).catch(function (e) {
                        console.error(e);
                    });
                    break;
                case 'google':
                    GoogleSignin.signIn().then(function (data) {
                        var profile = data.getBasicProfile();
                        return Auth.login({
                            id: profile.getId(),
                            email: profile.getEmail(),
                            first_name: profile.getGivenName(),
                            last_name: profile.getFamilyName(),
                            picture: profile.getImageUrl(),
                            method: provider
                        });
                    }).then(function (user) {
                        $state.go('profile');
                    });
                    break;
                default:
                    Auth.login({
                        username: vm.username,
                        password: vm.password,
                        method: 'local'
                    }).then(function (user) {
                        $state.go('profile');
                    });
                    break;
            }
        };
    }]);