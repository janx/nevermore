var helpers = require('./test_helper.js');

contract('OrderBook', function(accounts) {
  var user = helpers.toBytes32('ffff');
  var category = 0;
  var state = 0;
  var fee = 100;
  var timestamp = 2718281828;

  var encryptedSecret = helpers.toBytes32('ffff');
  var encryptedData = helpers.toBytes('1234567890abcdef1234567890abcdef1234567890abcdef');

  it("should set owner on contract creation", function(done) {
    var book = OrderBook.deployed();

    book.owner().then(function(owner) {
      assert.equal(owner, accounts[0]);
      done();
    }).catch(done);
  });

  it("should set credit book address", function(done) {
    var book = OrderBook.deployed();

    var bookAddress = helpers.toAddress('ffff');
    book.setCreditBook(bookAddress)
      .then(function(txid) {
        return book.creditBook();
      }).then(function(addr) {
        assert.equal(addr, bookAddress);
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
        assert.equal(addr, CreditBook.deployed_address);
        done();
      }).catch(done);
  });

  it("should validate record existence", function(done) {
    var creditBook = CreditBook.deployed();
    var orderBook = OrderBook.deployed();

    var eventPromise = Promise.promisify(orderBook.NewRequest);

    orderBook.setCreditBook(CreditBook.deployed_address)
      .then(function(txid) {
        return orderBook.submitRequest('123');
      }).then(function(txid) {
        assert(!txid, "submit succeed!");
      }).catch(function(e) {
        assert.match(e.message, /TransactionFailed/, "request submit should fail because requested record doesn't exist");
        done();
      });
  });

  it("should validate fee is covered", function(done) {
    var creditBook = CreditBook.deployed();
    var orderBook = OrderBook.deployed();

    var eventPromise = Promise.promisify(orderBook.NewRequest);

    var commit = helpers.genCommit();
    var last_id;

    orderBook.setCreditBook(CreditBook.deployed_address)
      .then(function(txid){
        return creditBook.submit(user, category, state, fee, timestamp, commit);
      }).then(function(txid) {
        return orderBook.submitRequest(commit, {value: 99});
      }).then(function(txid) {
        assert(!txid, "submit succeed!");
      }).catch(function(e) {
        assert.match(e.message, /TransactionFailed/, "request submit should fail because payment doesn't cover fee");
        done();
      });
  });

  it("should create a new request", function(done) {
    var creditBook = CreditBook.deployed();
    var orderBook = OrderBook.deployed();

    var eventPromise = Promise.promisify(orderBook.NewRequest);

    var commit = helpers.genCommit();

    orderBook.setCreditBook(CreditBook.deployed_address)
      .then(function(txid){
        return creditBook.submit(user, category, state, fee, timestamp, commit);
      }).then(function(txid) {
        eventPromise({})
          .then(function(result) {
            //            var value = accounts[0].slice(2) + commit.slice(2);
            //            var id = '0x' + web3.sha3(value, {encoding: 'hex'});

            //assert.equal(result.args.id, id);
            assert.equal(result.args.commit, commit);
            assert.equal(result.args.provider, accounts[0]);
            assert.equal(result.args.from, accounts[0]);
            done();
          }).catch(done);

        return orderBook.submitRequest(commit, {value: 100});
      }).catch(done);
  });

  it("should validate request id in response", function(done) {
    var creditBook = CreditBook.deployed();
    var orderBook = OrderBook.deployed();

    orderBook.setCreditBook(CreditBook.deployed_address)
      .then(function(txid){
         return orderBook.submitResponse(999999, encryptedSecret, "what_the_fox_say");
      }).then(function(txid) {
        assert(!txid, "submit succeed!");
      }).catch(function(e) {
        assert.match(e.message, /TransactionFailed/, "response submit should fail because there's no corresponding request");
        done();
      });
  })

  it("should validate responder is the original provider", function(done) {
    var creditBook = CreditBook.deployed();
    var orderBook = OrderBook.deployed();

    var eventPromise = Promise.promisify(orderBook.NewResponse);

    var commit = helpers.genCommit();

    //var value = accounts[0].slice(2) + commit.slice(2);
    //var id = '0x' + web3.sha3(value, {encoding: 'hex'});

    orderBook.setCreditBook(CreditBook.deployed_address)
      .then(function(txid){
        return creditBook.submit(user, category, state, fee, timestamp, commit);
      }).then(function(txid) {
        return orderBook.submitRequest(commit, {value: 100});
      }).then(function(txid) {
        return orderBook.size();
      }).then(function(size) {
        return orderBook.submitResponse(size-1, encryptedSecret, encryptedData, {from: accounts[1]});
      }).then(function(txid) {
        assert(!txid, "submit succeed!");
      }).catch(function(e) {
        assert.match(e.message, /TransactionFailed/, "response submit should fail because responder address doesn't equal record provider");
        done();
      });
  })

  it("should log new response", function(done) {
    var creditBook = CreditBook.deployed();
    var orderBook = OrderBook.deployed();

    var eventPromise = Promise.promisify(orderBook.NewResponse);

    var commit = helpers.genCommit();

    //var value = accounts[0].slice(2) + commit.slice(2);
    //var id = '0x' + web3.sha3(value, {encoding: 'hex'});

    orderBook.setCreditBook(CreditBook.deployed_address)
      .then(function(txid){
        return creditBook.submit(user, category, state, fee, timestamp, commit);
      }).then(function(txid) {
        return orderBook.submitRequest(commit, {value: 100});
      }).then(function(txid) {
        return orderBook.size();
      }).then(function(size) {
        eventPromise({})
          .then(function(result) {
            assert.equal(result.args.id.toString(), size.toString());
            done();
          }).catch(done);

        return orderBook.submitResponse(size-1, encryptedSecret, encryptedData);
      }).catch(done);
  });

  it("should save response on blockchain", function(done) {
    var creditBook = CreditBook.deployed();
    var orderBook = OrderBook.deployed();

    var eventPromise = Promise.promisify(orderBook.NewResponse);

    var commit = helpers.genCommit();

    //var value = accounts[0].slice(2) + commit.slice(2);
    //var id = '0x' + web3.sha3(value, {encoding: 'hex'});

    var reqId;
    orderBook.setCreditBook(CreditBook.deployed_address)
      .then(function(txid){
        return creditBook.submit(user, category, state, fee, timestamp, commit);
      }).then(function(txid) {
        return orderBook.submitRequest(commit, {value: 100});
      }).then(function(txid) {
        return orderBook.size();
      }).then(function(size) {
        reqId = size - 1;
        return orderBook.submitResponse(reqId, encryptedSecret, encryptedData);
      }).then(function(txid) {
        return orderBook.getResponse(reqId);
      }).then(function(result) {
        assert.equal(result[0], encryptedSecret);
        assert.equal(result[1], encryptedData);
        //done();
        return orderBook.getAllRequests();
      }).then(function(results) {
        //console.log(results);
        return orderBook.getAllResponses();
      }).then(function(results) {
        //console.log(results);
        done();
      }).catch(done);
  });
});
