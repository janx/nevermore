$(function() {
  console.log("start!!!!!");

  window.book = CreditBook.deployed();
  window.address = web3.eth.accounts[1];
  web3.eth.defaultAccount = address;
  console.log(web3.eth.defaultAccount);

  book.size().then(function(result) {
    console.log("size:", result.toString());
  }).catch(function(e) {
    console.log('fuck!!!!!!!!!!!!!!!!!!');
    console.log(e);
  });

  var event = book.NewRecord(null, 'latest');
  //event.get(function(err, results) {
  //  console.log(results);
  //});
  event.watch(function(err, result) {
    if(err) {
      console.log("error:", err);
    } else {
      console.log(result);
    }
  });

  book.submit('0xc305c901078781c232a2a521c2af70f8385ee9',0,0,1,2718281828, new Date().getTime().toString());
  book.submit('0xc305c901078781c232a2a521c2af70f8385ee9',1,0,1,2718281828, new Date().getTime().toString());
  book.submit('0xc305c901078781c232a2a521c2af70f8385ee9',2,0,1,2718281828, new Date().getTime().toString());

  //book.test('0xffffff', 0,0,0,0, '0xc305c901078781c232a2a521c2af70f8385ee9', 100).then(function (txid) {console.log(txid);});
  //book.test('0xeeeeee', 1,1,1,1, '0xc305c901078781c232a2a521c2af70f8385ee9', 200);
  //book.test('0xdddddd', 2,2,2,2, '0xc305c901078781c232a2a521c2af70f8385ee9', 300);
});
