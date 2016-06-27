window.app = angular.module('Nevermore', ['neverMoreFilters']);

angular.element(document).ready(function() {
  window.credit_book = CreditBook.deployed();
  window.order_book = OrderBook.deployed();
  window.currentUser = localStorage.getItem("currentUser") || web3.eth.accounts[0];
  order_book.setCreditBook(CreditBook.deployed_address, {from: currentUser});

  var accounts = web3.eth.accounts;
  for(var i=0; i < accounts.length; i++){
    Providers[accounts[i]] = {
      name: "NMore" + i,
      pubkey: "0xcccc" + i
    }
  }

  // Bootstrap Angualr module
  angular.bootstrap(document, ['Nevermore']);
});
