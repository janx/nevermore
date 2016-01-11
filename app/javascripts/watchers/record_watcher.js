function watchRecord()  {

  credit_book.NewRecord({}, { address: CreditBook.deployed_address}, function(error, result) {
    var own = false
    if(currentUser === result.args.provider) {
      own = true
    }

    var commit = result.args.commit;
    credit_book.get(commit).then(function(record) {
      var provider = record[0];
      var identity = record[1];
      var category = record[2];
      var state = record[3];
      var fee = record[4];
      var timestamp = record[5];

      var book = {
        identity: decodeFromBytes32(identity),
        category: category.toNumber(), // 0: 信用贷款 1: 担保贷款  2: 抵押贷款
        state: state.toNumber(), // 0: 申请中 1: 进行中 2: 已完结
        fee: fee.toNumber(),
        timestamp: timestamp.toString(), // unix timestamp
        provider: provider,
        commit: commit,
        orderstate: 0,
        owner: own
      };

      var included = false
      $.each(window.credit_records, function(index, record) {
        if(record.commit === book.commit) {
          included = true
        }
      });
      if(!included) {
        console.log("New record:", result);
        window.credit_records.push(book);
      }
      $.publish('CreditBook:create', book);
    }).catch(function(e) {
    });
  });
}
