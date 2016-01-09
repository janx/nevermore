var filters = angular.module('neverMoreFilters', [])
filters.filter('categoryFilter', function() {
  return function(input) {
    var result = "";
    switch(input) {
      case 0:
        result = "Credit Loan";
        break;
      case 1:
        result = "Category 1"
        break;
      case 2:
        resrlt = "Category 2"
        break;
    }

    return result;
  };
});

var app = angular.module('Nevermore', ['neverMoreFilters']);

app.controller('SearchCtrl', ['$scope', function ($scope) {

  $scope.creditRecords = [
    {
      id: 'ccb5c3f944732008d5c8b13a6c928f673bee8126',
      identity: '111111111111111111',
      category: 0,
      state: 0,
      fee: 10,
      timestamp: 1452268704,
      source: '43b2aa9c63ca995aa6766977fec06067'
    },
    {
      id: '8e6d63757c4aef7808850728f0c0520a4cce3755',
      identity: '111111111111111111',
      category: 0,
      state: 0,
      fee: 20,
      timestamp: 1452268704,
      source: '43b2aa9c63ca995aa6766977fec06067'
    },
    {
      id: 'dd248eae48a38df07eee39e0d5bb7d11ad885f13',
      identity: '111111111111111111',
      category: 1,
      state: 1,
      fee: 30,
      timestamp: 1452268704,
      source: '43b2aa9c63ca995aa6766977fec06067'
    },
    {
      id: 'aac65e92e5c17278a2df111dc17042f65a8aca56',
      identity: '111111111111111111',
      category: 1,
      state: 1,
      fee: 40,
      timestamp: 1452268704,
      source: '43b2aa9c63ca995aa6766977fec06067'
    }
  ]

  $scope.cart = cart = [];
  $scope.changeCart = function($event, cr) {
    var checkbox = $event.target;
    var action = (checkbox.checked ? 'add' : 'remove');
    if (action == 'add') {
      cart.push(cr);
    } else {
      var index = cart.indexOf(cr);
      if (index > -1) {
        cart.splice(index, 1);
      }
    }
  }
  $scope.getTotal = function() {
    var total = 0;
    for (var i = 0; i < $scope.cart.length; i++) {
      total += $scope.cart[i].fee;
    }
    return total;
  }
  $scope.buy = function() {
    alert('buy successful');
  }

  // $.subscribe('CreditBook:create', function(event, data){
  //   debugger
  // });

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
    };

    $.publish('CreditBook:create', book);
  });

  book.submit('0xc305c901078781c232a2a521c2af7980f8385ee9',0,0,1,2718281828, new Date().getTime().toString(), {from: address});
  book.submit('0xc305c901078781c232a2a521c2af7980f8385ee9',0,0,1,2718281828, new Date().getTime().toString(), {from: address});

  // Bootstrap Angualr module
  angular.bootstrap(document, ['Nevermore']);
});
