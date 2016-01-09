var filters = angular.module('neverMoreFilters', [])
filters.filter('categoryFilter', function() {
  return function(input) {
    var result = "";
    switch(input) {
      case 0:
        result = "Credit Loan";
        break;
      case 1:
        result = "Collateral Loan"
        break;
      case 2:
        result = "Guaranteed Loan"
        break;
    }

    return result;
  };
});


filters.filter('stateFilter', function() {
  return function(input) {
    var result = "";
    switch(input) {
      case 0:
        result = "Applying";
        break;
      case 1:
        result = "Ongoing";
        break;
      case 2:
        result = "Complete";
        break;
    }

    return result;
  }
});

var app = angular.module('Nevermore', ['neverMoreFilters']);

app.controller('SearchCtrl', ['$scope', function ($scope) {

  $scope.creditRecords = [
    {
      commit: 'ccb5c3f944732008d5c8b13a6c928f673bee8126',
      identity: '111111111111111111',
      category: 0,
      state: 0,
      providerName: 'Firm 1',
      providerReputation: 7,
      fee: 10,
      timestamp: 1452268704,
      source: '43b2aa9c63ca995aa6766977fec06067'
    },
    {
      commit: '8e6d63757c4aef7808850728f0c0520a4cce3755',
      identity: '111111111111111111',
      category: 1,
      state: 1,
      providerName: 'Firm 2',
      providerReputation: 8,
      fee: 20,
      timestamp: 1452268704,
      source: '43b2aa9c63ca995aa6766977fec06067'
    },
    {
      commit: 'dd248eae48a38df07eee39e0d5bb7d11ad885f13',
      identity: '111111111111111111',
      category: 2,
      state: 2,
      providerName: 'Firm 3',
      providerReputation: 9,
      fee: 30,
      timestamp: 1452268704,
      source: '43b2aa9c63ca995aa6766977fec06067'
    },
    {
      commit: 'aac65e92e5c17278a2df111dc17042f65a8aca56',
      identity: '111111111111111111',
      category: 1,
      state: 1,
      providerName: 'Firm 4',
      providerReputation: 10,
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
    var list = [];
    for (var i=0; i < cart.length; i ++) {
      list.push(cart[i].commit);
    }

    $.publish('CreditRecord:buy', list);
  }
}]);


app.controller('CreateCtrl', ['$scope', function ($scope) {

  $scope.categoryOptions = [
    {value: 0, name: 'Credit Loan'},
    {value: 1, name: 'Collateral Loan'},
    {value: 2, name: 'Guaranteed Loan'}
  ];
  $scope.creditRecord = creditRecord = {};

  $scope.createCreditBook = function() {
    console.info(creditRecord);
  }

  // $.subscribe('CreditBook:create', function(event, data){
  //   debugger
  // });

}]);

angular.element(document).ready(function() {
  var address = web3.eth.accounts[0]

  // watch the credit records.
  var credit_book = CreditBook.deployed();

  credit_book.NewRecord({}, { address: CreditBook.deployed_address}, function(error, result) {
    var book = {
      identity: result.args.user,
      category: result.args.category.toNumber(), // 0: 信用贷款 1: 担保贷款  2: 抵押贷款
      state: result.args.state.toNumber(), // 0: 申请中 1: 进行中 2: 已完结
      fee: result.args.fee.toNumber(),
      timestamp: result.args.timestamp.toString(), // unix timestamp
      provider: result.args.provider
    };

    $.publish('CreditBook:create', book);
  });

  // watch the requests

  request_book = OrderBook.deployed();
  request_book.NewRequest({}, { address: OrderBook.deployed_address}, function(error, result) {
    var request = {
    }
  });


  credit_book.submit('0xc305c901078781c232a2a521c2af7980f8385ee9',0,0,1,2718281828, new Date().getTime().toString(), {from: address});
  credit_book.submit('0xc305c901078781c232a2a521c2af7980f8385ee9',0,0,1,2718281828, new Date().getTime().toString(), {from: address});

  // Bootstrap Angualr module
  angular.bootstrap(document, ['Nevermore']);
});
