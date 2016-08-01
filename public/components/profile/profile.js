/**
 * Created by Muli Yulzary on 23-Jun-16.
 */
angular.module('app.components.profile', [
    'app.services'
])
    .controller('profileCtrl', ['$state', 'Auth', 'user',
        function ($state, Auth, user) {
            var vm = this;
            vm.user = user;
            vm.displayName = user.firstName();
            vm.picture = user.profilePicture();

            vm.logout = function () {
                Auth.logout();
                $state.go('home');
            };

            vm.refresh = function () {
                vm.user.$get();
            }
        }]);