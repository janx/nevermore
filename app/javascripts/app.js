window.app = angular.module('Nevermore', ['neverMoreFilters']);

angular.element(document).ready(function() {
  window.credit_book = CreditBook.deployed();
  window.order_book = OrderBook.deployed();
  window.currentUser = localStorage.getItem("currentUser") || web3.eth.accounts[0];
  order_book.setCreditBook(CreditBook.deployed_address, {from: currentUser});

  // Bootstrap Angualr module
  angular.bootstrap(document, ['Nevermore']);
});
