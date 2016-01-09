import 'owned';
import 'mortal';
import 'CreditBook';

contract OrderBook is owned, mortal {

//  struct Request {
//    address provider;
//    address from;
//    bytes32 commit;
//  }
//
//  struct Response {
//    // bytes32 encryptionMethod;
//    // bytes32 nonce;
//    bytes32 encryptedSecret; // secret encrypted with requester's pubkey. used to encrypt response data
//    bytes encryptedData;
//  }

  address public owner;
  address public creditBook;

  //mapping(bytes32 => Request) public requests;
  //mapping(bytes32 => Response) public responses;
  mapping(bytes32 => uint256) public reqIds;

  address[] reqProviders;
  address[] reqFroms;
  bytes32[] reqCommits;
  uint256[] reqExpireDates;
  uint256[] reqFees;

  bytes32[] respEncryptedSecrets;
  bytes[]   respEncryptedData;

  event NewRequest(address indexed provider, address indexed from, uint256 indexed id, bytes32 commit);
  event NewResponse(uint256 indexed id);

  function OrderBook() {
    owner = msg.sender;
  }

  function setCreditBook(address addr) external onlyowner {
    creditBook = addr;
  }

  function size() constant returns (uint256) {
    return reqCommits.length;
  }

  function getRequest(uint256 id) constant returns (address, address, bytes32) {
    return (reqProviders[id], reqFroms[id], reqCommits[id]);
  }

  function getResponse(uint256 id) constant returns (bytes32, bytes) {
    return (respEncryptedSecrets[id], respEncryptedData[id]);
  }

  function getAllRequests() constant returns (address[], address[], bytes32[]) {
    return (reqProviders, reqFroms, reqCommits);
  }

  function getAllResponses() constant returns (bytes32[]) {
    return (respEncryptedSecrets);
  }

  function submitRequest(bytes32 commit) external {
    address provider;
    bytes32 user;
    uint16  category;
    uint16  state;
    uint256 fee;
    uint256 timestamp;
    (provider, user, category, state, fee, timestamp) = CreditBook(creditBook).get(commit);

    if(provider == 0x0) throw;
    if(msg.value < fee) throw; // TODO: should we refund extra fee?

    bytes32 rid = sha3(msg.sender, commit);
    if(reqIds[rid] != 0x0) throw;

    //requests[id] = Request(provider, msg.sender, commit);
    reqIds[rid] = reqCommits.length;
    reqProviders.push(provider);
    reqFroms.push(msg.sender);
    reqCommits.push(commit);
    reqExpireDates.push(now + 1 days);
    reqFees.push(msg.value);

    NewRequest(provider, msg.sender, reqIds[rid], commit);
  }

  // requester call after request expired to get refund
  function refund(uint256 id) external {
    address provider = reqProviders[id];
    if(provider != msg.sender) throw;

    if(now > reqExpireDates[id]) {
      reqFroms[id].send(reqFees[id]);

      // TODO: penalty of responder
    }
  }

  function submitResponse(uint256 id, bytes32 encryptedSecret, bytes encryptedData) external {
    if(encryptedSecret == bytes32(0x0)) throw;

    address provider = reqProviders[id];
    if(provider != msg.sender) throw;

    //responses[id] = Response(encryptedSecret, encryptedData);

    // fill up dyanmic array until the wanted position
    uint256 i;
    for(i = respEncryptedSecrets.length; i <= id; i++) {
      respEncryptedSecrets.push(0x0);
    }
    // then assign the value
    respEncryptedSecrets[id] = encryptedSecret;

    for(i = respEncryptedData.length; i <= id; i++) {
      respEncryptedData.push("0x0");
    }
    respEncryptedData[id] = encryptedData;

    NewResponse(id+1);

    // TODO: transfer fee to Payment contract
  }

}
