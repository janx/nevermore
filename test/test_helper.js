var commit = 0;

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

var toAddress = function(hex) {
  return '0x'+hexPadding(hex, 40);
};

var genCommit = function() {
  commit += 1;
  return toBytes32(''+commit);
}

module.exports = {
  hexPadding: hexPadding,
  toBytes: toBytes,
  toBytes32: toBytes32,
  toAddress: toAddress,
  genCommit: genCommit
};
