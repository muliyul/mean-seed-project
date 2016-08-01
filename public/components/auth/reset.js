angular.module('app.components.auth.reset', [
    'app.services'
])
    .controller('resetPassCtrl', ['API', function (API) {
        var vm = this;

        vm.resetPassword = function () {
            API.User.resetPassword({email: vm.email}).$promise
                .then(function (res) {
                    console.log(res);
                })
                .catch(console.error);
        }
    }]);