contract('CreditBook', function(accounts) {

  it("should set owner on contract creation", function(done) {
    var book = CreditBook.deployed();

    book.owner().then(function(owner) {
      assert.equal(accounts[0], owner);
      done();
    }).catch(done);
  });

  it("should submit new record", function(done) {
    var book = CreditBook.deployed();

    var event = book.NewRecord({});
    event.watch(function(error, result) {
      if(!error) {
        assert.equal(user, result.args.user);
        assert.equal('0', result.args.id.toString());
        assert.equal('100', result.args.fee.toString());
        assert.equal('2718281828', result.args.timestamp.toString());
        assert.equal(accounts[0], result.args.provider);
        done();
      }
    });

    var user = '0x0000000000000000000000000000000000000000000000000000000012345678';
    var category = 0;
    var state = 0;
    var fee = 100;
    var timestamp = 2718281828;
    var commit = 'abcdefg';
    book.submit(user, category, state, fee, timestamp, commit);
  });

});
