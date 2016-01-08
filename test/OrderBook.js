contract('OrderBook', function(accounts) {

  it("should set owner on contract creation", function(done) {
    var book = OrderBook.deployed();

    book.owner().then(function(owner) {
      assert.equal(accounts[0], owner);
      done();
    }).catch(done);
  });

});
