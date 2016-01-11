nonce = 0;

function randomBytes32() {
  var timestamp = new Date().getTime();
  nonce += 1
  return '0x'+web3.sha3(''+nonce+timestamp, {encoding: 'hex'});
}

function genRec() {
  var commit = randomBytes32();
  var identity = encodeToBytes32('112123234323456787');
  var category = 0;
  var state = 0;
  var fee = 1;
  var timestamp = Math.floor(new Date() / 1000);

  var data = {
    commit: commit,
    identity: identity,
    category: category,
    state: state,
    timestamp: timestamp,
    fee: fee,
  default: null,
    principal: null,
    rate: null,
    duration: null,
    start_date: null,
    guarantor: null,
    collateral: null,
    desc:null
  };

  localStorage.setItem(commit, angular.toJson(data));
  return credit_book.submit(identity,category,state,fee,timestamp, commit, {from: currentUser});
}


function generateRecords() {
  Promise.all([genRec(), genRec(), genRec(), genRec(), genRec(), genRec()])
  .then(function(results) {
    console.log("records generated:", results);
  });
}

function hexPadding(hex, len) {
  for(var i=hex.length; i<len; i++) {
    hex = '0' + hex;
  }
  return hex;
};

function toBytes(hex) {
  return '0x'+hex;
};

function toBytes32(hex) {
  return '0x'+hexPadding(hex, 64);
};

function fromBytes32(hex) {
  return hex.replace(/^(0x0*)/, '')
};

function encodeToBytes32(str) {
  return toBytes32(web3.toHex('_v1_'+str).slice(2));
};

function decodeFromBytes32(hex) {
  return web3.toAscii('0x' + fromBytes32(hex)).replace(/^_v1_/, '');
}


function encryptForProvider(provider, pt) {
  // mock provider pubkey encrypt
  var pubkey = Providers[provider].pubkey;
  return encodeToBytes32(pubkey+pt).slice(0,64);
}

function aesEncrypt(key, pt) {
  // mock aes encryption
  return encodeToBytes32("aes encrypted"+pt);
}
