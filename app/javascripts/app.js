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

  var events = book.allEvents({fromBlock: 0, toBlock: 'latest'});

  var events = book.NewRecord({}, {fromBlock: 0, toBlock: 'latest', address: CreditBook.deployed_address}, function(error, result) {
    var book = {
      identity: result.args.user,
      category: result.args.category.toNumber(), // 0: 信用贷款 1: 担保贷款  2: 抵押贷款
      state: result.args.state.toNumber(), // 0: 申请中 1: 进行中 2: 已完结
      fee: result.args.fee.toNumber(),
      timestamp: result.args.timestamp.toString(), // unix timestamp
      source: result.args.source
    }
  });



  book.submit('0xc305c901078781c232a2a521c2af7980f8385ee9',0,0,1,2718281828, new Date().getTime().toString(), {from: address});
  book.submit('0xc305c901078781c232a2a521c2af7980f8385ee9',0,0,1,2718281828, new Date().getTime().toString(), {from: address});

  // Bootstrap Angualr module
  angular.bootstrap(document, ['Nevermore']);
});
