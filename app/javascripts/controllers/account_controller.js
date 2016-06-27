app.controller('AccountCtrl', ['$scope', function ($scope) {
  $scope.coinbase = currentUser || web3.eth.accounts[0];
  $scope.accounts = web3.eth.accounts;

  $scope.$watch('coinbase', function(val, old){
    if(val != old && window.currentUser != val){
      window.currentUser = web3.eth.defaultAccount =  $scope.coinbase = val;
      localStorage.setItem("currentUser", val);
      loadBook();
    }
  });

}]);
