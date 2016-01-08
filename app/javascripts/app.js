console.log("jQuery loaded");
console.log($);
console.log("Angular loaded");
console.log(angular);

// Try to communicate with blockchain
$(document).ready(function(){
  var book = CreditBook.deployed();

  var address = web3.eth.accounts[0]
});
