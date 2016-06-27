// flash
$.subscribe('notice', function(event, notice){
  toastr.info(notice)
});

$.subscribe('Response:new', function(event, data) {

  var id = '';
  $.each(window.requests, function(index, request) {
    if(request.commit == data.commit) {
      id = request.id;
    }
  });

  console.log('Response:new', event, data);
  order_book.submitResponse(id, data.secret, data.content, {from: currentUser});
});

// buy
$.subscribe('CreditRecord:buy', function(event, data){
  records = data.list
  for(var i = 0; i < records.length; i++) {
    var fee = records[i].fee;
    var commit = records[i].commit;

    order_book.submitRequest(commit, {value: fee, from: currentUser});
  }
})

// deliver data to buyer
$.subscribe('Request:create', function(event, request) {
  var commit = request.commit;
  var pubkey = request.from;

  var data = localStorage.getItem(commit);
  console.log("New request received", request);
  if (data) {
    var aesKey = randomBytes32();
    var secret = encryptForProvider(request.provider, aesKey);
    //var encryptedData = aesEncrypt(secret, data);
    var encryptedData = data; // use plain text for now
    console.log("Auto respond to request: " + request);
    setTimeout(function(){
      $.publish('Response:new', {commit: commit, secret: secret, content: encryptedData});
    }, 2000);
  }
});

