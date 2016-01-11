function watchRequest() {
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

}
