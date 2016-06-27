function watchResponse() {
  order_book.NewResponse({}, {address: OrderBook.deployed_address}, function(error, result) {
    var id = result.args.id.toNumber();

    order_book.getResponse(id).then(function(result) {
      request = window.requests[id]
      if(currentUser === request.from) {
        $.publish('notice', 'Your request has been responsed.');

        console.log('got response......', result);

        $.each(credit_records, function(index, value) {
          if(value.commit === request.commit) {
            localStorage.setItem(value.commit, web3.toAscii(result[1]));
            value.orderstate = 2;
          }
        });

        $('#result-modal').modal('show');
      }
      if(currentUser === request.provider) {
        $.publish('notice', 'Your response has been sent automatically.');
      }
    });
  });

}
