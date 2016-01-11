angular.element(document).ready(function() {
  // initialize credit records
  credit_book.all({}).then(function(records){
    if(records[0].length > 0 ) {
      for(var i=0; i<records[0].length; i++) {
        record = {};
        record.provider = records[0][i].toString();
        record.identity = decodeFromBytes32(records[1][i].toString());
        record.category = records[2][i].toNumber();
        record.state = records[3][i].toNumber();
        record.fee = records[4][i].toNumber();
        record.timestamp = records[5][i].toNumber();
        record.commit = records[6][i].toString();
        record.orderstate = 0;
        if(currentUser === record.provider) {
          record.owner = true;
        } else {
          record.owner = false;
        }
        window.credit_records.push(record);
      }
    }
  }).then(function(){
    // initialize requests
    order_book.getAllRequests({}).then(function(result){
      for(var i=0; i < result[0].length; i++) {
        request = {};
        request.id = i;
        request.provider = result[0][i];
        request.from = result[1][i];
        request.commit = result[2][i];
        window.requests.push(request);

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
      }
    }).then(function(result){
      // init responses
      order_book.getAllResponses({from: currentUser}).then(function(result){
        // order_book.submitResponse(2, 'ffff', "ffff", {from: currentUser})
        //
        $.each(result, function(index, value) {
          if(value !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
            var commit = window.requests[index].commit;
            if(requests[index].from === currentUser) {
              $.each(window.credit_records, function(index, value) {
                if(value.commit === commit) {
                  value.orderstate = 2;
                }
              });
            }
          }
        });

      });
      // merge response

      $.publish("CreditBook:list");
    });
  });
});
