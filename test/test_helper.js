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
