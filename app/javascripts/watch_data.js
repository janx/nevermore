angular.element(document).ready(function() {
  // watch the credit records.

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

  // watch request
  order_book.NewRequest({}, { address: OrderBook.deployed_address}, function(error, result) {
    var req;
    $.each(window.requests, function(i, r) {
      if(r.id === result.args.id.toNumber()) {
        req = r;
      }
    });
    if(req) return;

    var request = {
      id: result.args.id.toNumber(),
      provider: result.args.provider,
      from: result.args.from,
      commit: result.args.commit
    }

    related = false;
    if(currentUser === request.from) {
      related = true;
    }

    if(related) {
      $.each(window.credit_records, function(index, record) {
        if(record.commit === request.commit){
          record.orderstate = 1;
        }
      });
    }

    window.requests.push(request)
    if(currentUser === request.from) {
      $.publish('notice', 'Request send successfully.');
    }

    if(currentUser === request.provider) {
      $.publish('notice', 'You received a request.');
      $.publish('Request:create', request)
    }
  });

  order_book.NewResponse({}, {address: OrderBook.deployed_address}, function(error, result) {
    var id = result.args.id.toNumber();

    order_book.getResponse(id).then(function(result) {
      request = window.requests[id]
      if(currentUser === request.from) {
        $.publish('notice', 'Your request has been responsed.');

        $.each(credit_records, function(index, value) {
          if(value.commit === request.commit) {
            localStorage.setItem(value.commit, web3.toAscii(result[1]));
            value.orderstate = 2;
          }
        });
      }
      if(currentUser === request.provider) {
        $.publish('notice', 'Your response has been sent automatically.');
      }
    });
  });
});
