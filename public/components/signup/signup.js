/**
 * Created by Muli Yulzary on 23-Jun-16.
 */
angular.module('app.components.signup', [])
    .controller('signupCtrl', ['$state', 'Auth', function ($state, Auth) {
        var vm = this;

        vm.signup = function () {
            Auth.signup(vm.username, vm.password).then(function () {
                $state.go('profile');
            }).catch(function (e) {
                console.error(e);
            });
        };
    }]);