window.currentUser = null;

window.credit_records = []
window.requests = []

window.Providers = {
  "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1": {
    name: "CreditSoft",
    pubkey: "0xffff"
  },
  "0x7d577a597b2742b498cb5cf0c26cdcd726d39e6e": {
    name: "SocialHard",
    pubkey: "0xeeee"
  },
  "0xdceceaf3fc5c0a63d195d69b1a90011b7b19650d": {
    name: "BlackScore",
    pubkey: "0xdddd"
  }
};

// fixtures

var nonce = 0;
function randomBytes32() {
  var timestamp = new Date().getTime();
  nonce += 1
  return web3.sha3(''+nonce+timestamp, {encoding: 'hex'});
}

function generateRecords() {
  credit_book.submit(encodeToBytes32('112123234323456787'),0,0,1,2718281828, randomBytes32(), {from: currentUser});
  credit_book.submit(encodeToBytes32('112123234323456787'),0,0,1,2718281828, randomBytes32(), {from: currentUser});
  credit_book.submit(encodeToBytes32('112123234323456787'),0,0,1,2718281828, randomBytes32(), {from: currentUser});
  credit_book.submit(encodeToBytes32('112123234323456787'),0,0,1,2718281828, randomBytes32(), {from: currentUser});
  credit_book.submit(encodeToBytes32('112123234323456787'),0,0,1,2718281828, randomBytes32(), {from: currentUser});
  credit_book.submit(encodeToBytes32('112123234323456787'),0,0,1,2718281828, randomBytes32(), {from: currentUser});
}

window.generageData = function() {

  var data = [
    {
      commit: 'ccb5c3f944732008d5c8b13a6c928f673bee8126',
      identity: '111111111111111111',
      category: 0,
      state: 0,
      providerName: 'Firm 1',
      providerReputation: 7,
      fee: 10,
      timestamp: 1452268704,
      owner: true,
      orderstate: 0,
      source: '43b2aa9c63ca995aa6766977fec06067'
    },
    {
      commit: '8e6d63757c4aef7808850728f0c0520a4cce3755',
      identity: '111111111111111111',
      category: 1,
      state: 1,
      providerName: 'Firm 2',
      providerReputation: 8,
      fee: 20,
      timestamp: 1452268704,
      owner: false,
      orderstate: 0,
      source: '43b2aa9c63ca995aa6766977fec06067'
    },
    {
      commit: 'dd248eae48a38df07eee39e0d5bb7d11ad885f13',
      identity: '111111111111111111',
      category: 2,
      state: 2,
      providerName: 'Firm 3',
      providerReputation: 9,
      fee: 30,
      timestamp: 1452268704,
      owner: false,
      orderstate: 0,
      source: '43b2aa9c63ca995aa6766977fec06067'
    },
    {
      commit: 'aac65e92e5c17278a2df111dc17042f65a8aca56',
      identity: '111111111111111111',
      category: 1,
      state: 1,
      providerName: 'Firm 4',
      providerReputation: 10,
      fee: 40,
      timestamp: 1452268704,
      owner: false,
      orderstate: 1,
      source: '43b2aa9c63ca995aa6766977fec06067'
    }
  ]

  for (var i=0; i < data.length; i++) {
    window.credit_records.push(data[i]);
  }
}

// Utils methods
var hexPadding = function(hex, len) {
  for(var i=hex.length; i<len; i++) {
    hex = '0' + hex;
  }
  return hex;
};

var toBytes = function(hex) {
  return '0x'+hex;
};

var toBytes32 = function(hex) {
  return '0x'+hexPadding(hex, 64);
};

var fromBytes32 = function(hex) {
  return hex.replace(/^(0x0*)/, '')
};

var encodeToBytes32 = function(str) {
  return toBytes32(web3.toHex('_v1_'+str).slice(2));
};

var decodeFromBytes32 = function(hex) {
  return web3.toAscii('0x' + fromBytes32(hex)).replace(/^_v1_/, '');
}


var encryptForProvider = function(provider, pt) {
  // mock provider pubkey encrypt
  var pubkey = Providers[provider].pubkey;
  return encodeToBytes32(pubkey+pt).slice(0,64);
}

var aesEncrypt = function(key, pt) {
  // mock aes encryption
  return encodeToBytes32("aes encrypted"+pt);
}

var filters = angular.module('neverMoreFilters', [])
filters.filter('categoryFilter', function() {
  return function(input) {
    var result = "";
    switch(input) {
      case 0:
        result = "Credit Loan";
        break;
      case 1:
        result = "Collateral Loan"
        break;
      case 2:
        result = "Guaranteed Loan"
        break;
    }

    return result;
  };
});


filters.filter('stateFilter', function() {
  return function(input) {
    var result = "";
    switch(input) {
      case 0:
        result = "Applying";
        break;
      case 1:
        result = "Ongoing";
        break;
      case 2:
        result = "Complete";
        break;
    }

    return result;
  }
});

filters.filter('providerName', function() {
  return function(input) {
    var provider = Providers[input];
    if(provider) {
      return provider.name;
    } else {
      return 'Unknown';
    }
  };
});

var app = angular.module('Nevermore', ['neverMoreFilters']);

app.controller('SearchCtrl', ['$scope', function ($scope) {

  $scope.creditRecords = function() {
    return window.credit_records;
  }

  $scope.buyable = function(cr) {
    if (cr.owner) {
      return false;
    }

    if (cr.orderstate === 0) {
      return true;
    } else {
      return false;
    }
  }

  $scope.reviewable = function(cr) {
    if (cr.owner) {
      return true;
    }

    if (cr.orderstate === 2) {
      return true;
    } else {
      return false;
    }
  }

  var source = $("#detail-data-template").html();
  var template = Handlebars.compile(source);
  $scope.showDetailData = function(commit) {
    console.log('showDetailData', commit);
    var data = localStorage.getItem(commit);
    var dataModal = $('#detail-data-modal')
    if (data) {
      data = angular.fromJson(data)
      dataModal.find('.card').html(template(data))
      dataModal.find('.identity').text("ID: " + data.identity)
      dataModal.modal('show');
    }
  }

  var cart = $scope.cart = [];

  $scope.changeCart = function($event, cr) {
    var checkbox = $event.target;
    var action = (checkbox.checked ? 'add' : 'remove');
    if (action == 'add') {
      cart.push(cr);
    } else {
      var index = cart.indexOf(cr);
      if (index > -1) {
        cart.splice(index, 1);
      }
    }
  }

  $scope.getTotal = function() {
    var total = 0;
    for (var i = 0; i < $scope.cart.length; i++) {
      total += $scope.cart[i].fee;
    }
    return total;
  }

  $scope.buy = function() {
    var list = [];
    for (var i=0; i < cart.length; i ++) {
      item = cart[i];
      list.push({commit: item.commit, fee: item.fee});
    }

    $.publish('CreditRecord:buy', {list: list});

    $('#purchase-modal').modal('hide');

    for (var i=0; i < cart.length; i++) {
      cart[i].orderstate = 1;
    }

    $scope.cleanup();

    $('#result-modal').modal('show');
  }

  $scope.cleanup = function() {
    cart.splice(0, cart.length);
  }
}]);


app.controller('CreateCtrl', ['$scope', function ($scope) {

  function SHA256(msg) {
    return CryptoJS.SHA256(msg).toString(CryptoJS.enc.Hex);
  }

  function makeHash(creditRecord) {
    // TODO: make a better rule for generate hash
    var msg = "" + creditRecord.identity + (new Date()).toString()
    return '0x' + web3.sha3(msg, {encoding: "hex"});
  }

  $scope.categoryOptions = [
    {value: 0, name: 'Credit Loan'},
    {value: 1, name: 'Collateral Loan'},
    {value: 2, name: 'Guaranteed Loan'}
  ];
  $scope.stateOptions = [
    {value: 0, name: 'Applying'},
    {value: 1, name: 'Ongoing'},
    {value: 2, name: 'Complete'}
  ]

  $scope.creditRecord = creditRecord = {};

  $scope.createCreditRecord = function() {
    var commit = makeHash(creditRecord)

    console.log(commit);
    var data = {
      commit: commit,
      identity: creditRecord.identity,
      category: creditRecord.category,
      state: creditRecord.state,
      timestamp: Math.floor(new Date() / 1000),
      fee: creditRecord.fee,
      default: creditRecord.default,
      principal: creditRecord.principal,
      rate: creditRecord.rate,
      duration: creditRecord.duration,
      start_date: creditRecord.start_date,
      guarantor: creditRecord.guarantor,
      collateral: creditRecord.collateral,
      desc: creditRecord.desc
    }

    localStorage.setItem(commit, angular.toJson(data));

    // TODO: reset form after create

    credit_book.submit(
      encodeToBytes32(data.identity),
      data.category,
      data.state,
      data.fee,
      data.timestamp,
      data.commit,
      {from: currentUser}
    ).catch(function(e) {
      console.log(e)
    });

    // close upload modal
    $('#upload-modal').modal('hide');
  }

}]);

angular.element(document).ready(function() {
  window.credit_book = CreditBook.deployed();
  window.order_book = OrderBook.deployed();
  window.currentUser = localStorage.getItem("currentUser") || web3.eth.accounts[0];
  order_book.setCreditBook(CreditBook.deployed_address, {from: currentUser});


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
    request = window.requests[id]
    if(currentUser === request.from) {
      $.publish('notice', 'Your request has been responsed.');

      $.each(credit_records, function(index, value) {
        if(value.commit === request.commit) {
          value.orderstate = 2;
        }
      });
    }
    if(currentUser === request.provider) {
      $.publish('notice', 'Your response has been sent automatically.');
    }
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
      var encryptedData = aesEncrypt(secret, data);
      console.log("Auto respond to request: " + request);
      setTimeout(function(){
        $.publish('Response:new', {commit: commit, secret: secret, content: encryptedData});
      }, 5000);
    }
  });

  // Bootstrap Angualr module
  angular.bootstrap(document, ['Nevermore']);
});
