console.log("jQuery loaded");
console.log($);
console.log("Angular loaded");
console.log(angular);

var app = angular.module('Nevermore', []);
app.controller('SearchCtrl', ['$scope', function ($scope) {

  $scope.creditRecords = [
    {
      identity: '11111111111111111',
      category: 0,
      state: 0,
      fee: 10,
      timestamp: 1452268704,
      source: '43b2aa9c63ca995aa6766977fec06067'
    },
    {
      identity: '22222222222222222',
      category: 1,
      state: 1,
      fee: 10,
      timestamp: 1452268704,
      source: '43b2aa9c63ca995aa6766977fec06067'
    }
  ]

}]);

angular.element(document).ready(function() {
  // Try to communicate with blockchain
  var book = CreditBook.deployed();
  var address = web3.eth.accounts[0]

  // Bootstrap Angualr module
  angular.bootstrap(document, ['Nevermore']);
});
