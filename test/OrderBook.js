contract('OrderBook', function(accounts) {
  var user = '0x0000000000000000000000000000000000000000000000000000000012345678';
  var category = 0;
  var state = 0;
  var fee = 100;
  var timestamp = 2718281828;

  var commit = 0;
  var genCommit = function() {
    commit += 1;
    return ''+commit;
  };

  it("should set owner on contract creation", function(done) {
    var book = OrderBook.deployed();

    book.owner().then(function(owner) {
      assert.equal(accounts[0], owner);
      done();
    }).catch(done);
  });

  it("should set credit book address", function(done) {
    var book = OrderBook.deployed();

    book.setCreditBook(0x123)
      .then(function(txid) {
        return book.creditBook();
      }).then(function(addr) {
        assert.equal('0x0000000000000000000000000000000000000123', addr);
        done();
      }).catch(done);
  });

  it("should have credit book set", function(done) {
    var orderBook = OrderBook.deployed();
    var creditBook = CreditBook.deployed();

    // truffle doesn't support deploy with constructor parameter, be stupid.
    orderBook.setCreditBook(CreditBook.deployed_address)
      .then(function(txid) {
        return orderBook.creditBook();
      }).then(function(addr) {
        assert.equal(CreditBook.deployed_address, addr);
        done();
      }).catch(done);
  });

  it("should validate record existence", function(done) {
    var creditBook = CreditBook.deployed();
    var orderBook = OrderBook.deployed();

    var eventPromise = Promise.promisify(orderBook.NewRequest);

    orderBook.setCreditBook(CreditBook.deployed_address)
      .then(function(txid) {
        return orderBook.request('123');
      }).then(function(txid) {
        assert(!txid, "request succeed!");
      }).catch(function(e) {
        assert.match(e.message, /TransactionFailed/, "request should fail because requested record doesn't exist")
        done();
      });
  });

  it("should create a new request", function(done) {
    var creditBook = CreditBook.deployed();
    var orderBook = OrderBook.deployed();

    var eventPromise = Promise.promisify(orderBook.NewRequest);

    var commit = genCommit();
    var last_id;

    orderBook.setCreditBook(CreditBook.deployed_address)
      .then(function(txid){
        return orderBook.size();
      }).then(function(size) {
        last_id = size - 1;
      }).then(function(txid) {
        return creditBook.submit(user, category, state, fee, timestamp, commit);
      }).then(function(txid) {
        eventPromise({})
          .then(function(result) {
            assert.equal((last_id+1).toString(), result.args.id.toString());
            assert.equal('0x1000000000000000000000000000000000000000000000000000000000000000', result.args.commit);
            assert.equal(accounts[0], result.args.provider);
            done();
          }).catch(done);

       orderBook.request(commit);
      }).catch(done);
  });
});
