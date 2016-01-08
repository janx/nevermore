console.log("jQuery loaded");
console.log($);
console.log("Angular loaded");
console.log(angular);


// Bootstrap Angualr module
angular.module('Nevermore', [])
  .controller('MyController', ['$scope', function ($scope) {
    $scope.greetMe = 'World';
  }]);

angular.element(document).ready(function() {
  angular.bootstrap(document, ['Nevermore']);
});
