contract('CreditBook', function(accounts) {
  var user = '0x0000000000000000000000000000000000000000000000000000000012345678';
  var category = 0;
  var state = 0;
  var fee = 100;
  var timestamp = 2718281828;
  var commit = 'abcdefg';

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
      book.submit(user, category, state, fee, timestamp, commit),
      book.submit(user, category, state, fee, timestamp, commit)
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

      book.submit(user, category, state, fee, timestamp, commit);
    }).catch(done);
  });

});
