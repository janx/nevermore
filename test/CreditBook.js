contract('CreditBook', function(accounts) {
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
    var book = CreditBook.deployed();

    book.owner().then(function(owner) {
      assert.equal(accounts[0], owner);
      done();
    }).catch(done);
  });

  it("should get record size", function(done) {
    var book = CreditBook.deployed();

    Promise.all([
      book.submit(user, category, state, fee, timestamp, genCommit()),
      book.submit(user, category, state, fee, timestamp, genCommit())
    ]).then(function() {
      return book.size();
    }).then(function(size) {
      assert.equal('2', size.toString());
      done();
    }).catch(done);
  });

  it("should submit new record", function(done) {
    var book = CreditBook.deployed();

    var eventPromise = Promise.promisify(book.NewRecord);

    var last_id;
    book.size().then(function(size) {
      last_id = size - 1;

      eventPromise({})
        .then(function(result) {
          assert.equal(user, result.args.user);
          assert.equal((last_id+1).toString(), result.args.id.toString());
          assert.equal('100', result.args.fee.toString());
          assert.equal('2718281828', result.args.timestamp.toString());
          assert.equal(accounts[0], result.args.provider);
          done();
        }).catch(done);

      book.submit(user, category, state, fee, timestamp, genCommit());
    }).catch(done);
  });

  it("should validate commit uniqueness", function(done) {
    var book = CreditBook.deployed();

    book.submit(user, category, state, fee, timestamp, 'usedcommit')
      .then(function(txid) {
        return book.submit(user, category, state, fee, timestamp, 'usedcommit');
      }).then(function(txid) {
        assert(!txid, "the second submit should not be succeed!");
      }).catch(function(e) {
        assert.match(e.message, /TransactionFailed/, "submit should fail");
        done();
      });
  });

  it("should validate user hash", function(done) {
    var book = CreditBook.deployed();

    book.submit(0, category, state, fee, timestamp, genCommit())
      .then(function(txid) {
        assert(!txid, "submit succeed!");
      }).catch(function(e) {
        assert.match(e.message, /TransactionFailed/, "submit should fail because user is zero");
        done();
      });
  });

  it("should validate timestamp", function(done) {
    var book = CreditBook.deployed();

    book.submit(user, category, state, fee, 0, genCommit())
      .then(function(txid) {
        assert(!txid, "submit succeed!");
      }).catch(function(e) {
        assert.match(e.message, /TransactionFailed/, "submit should fail because timestamp is zero");
        done();
      });
  });

});
