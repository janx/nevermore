window.credit_records = []

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

  $scope.creditRecords = []

  $.subscribe('CreditBook:list', function() {
    $.each(window.credit_records, function(index, value){
      $scope.creditRecords.push(value);
    });
  });

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
      item = cart[i];
      list.push({commit: item.commit, fee: item.fee});
    }

    $.publish('CreditRecord:buy', {list: list});
  }
}]);


app.controller('CreateCtrl', ['$scope', function ($scope) {

  $scope.categoryOptions = [
    {value: 0, name: 'Credit Loan'},
    {value: 1, name: 'Collateral Loan'},
    {value: 2, name: 'Guaranteed Loan'}
  ];
  $scope.stateOptions = [
    {value: 0, name: 'Applying'},
    {value: 1, name: 'Ongoing'},
    {value: 2, name: 'Complete'}
  ]

  $scope.creditRecord = creditRecord = {};

  $scope.createCreditBook = function() {
    console.info(creditRecord);
  }

  // $.subscribe('CreditBook:create', function(event, data){
  //   debugger
  // });

}]);

angular.element(document).ready(function() {
  var address = web3.eth.accounts[0];
  var credit_book = CreditBook.deployed();
  var order_book = OrderBook.deployed();


  // initialize credit records
  credit_book.all({}).
    then(function(records){
      if(records[0].length > 0 ) {

        for(var i=0; i<records[0].length; i++) {
          record = {};
          record.provider = records[0][i].toString();
          record.identity = records[1][i].toString();
          record.category = records[2][i].toNumber();
          record.state = records[3][i].toNumber();
          record.fee = records[4][i].toNumber();
          record.timestamp = records[5][i].toNumber();
          record.commit = records[6][i].toString();
          window.credit_records.push(record);
        }

        $.publish("CreditBook:list");
      }
    }).then(function(){
      // initialize requests
      order_book.getAllRequests({}).
        then(function(reqProviders, reqFroms, reqCommits){
        });

    });


  // watch the credit records.

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


  // buy
  //
  $.subscribe('CreditRecord:buy', function(event, data){
    records = data.list
    for(var i = 0; i < records.length; i++) {
      var fee = records[i].fee;
      var commit = records[i].commit;

    }
  })

  // Bootstrap Angualr module
  angular.bootstrap(document, ['Nevermore']);
});
