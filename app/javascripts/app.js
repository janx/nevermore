console.log("jQuery loaded");
console.log($);
console.log("Angular loaded");
console.log(angular);

<<<<<<< HEAD

// Bootstrap Angualr module
angular.module('Nevermore', [])
  .controller('MyController', ['$scope', function ($scope) {
    $scope.greetMe = 'World';
  }]);

angular.element(document).ready(function() {
  // Try to communicate with blockchain
  var book = CreditBook.deployed();
  var address = web3.eth.accounts[0]

  angular.bootstrap(document, ['Nevermore']);
});
