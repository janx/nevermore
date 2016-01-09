import 'owned';
import 'mortal';
import 'CreditBook';

contract OrderBook is owned, mortal {

  struct Request {
    address provider;
    address from;
    bytes32 commit;
  }

  struct Response {
    // bytes32 encryptionMethod;
    // bytes32 nonce;
    bytes32 encryptedSecret; // secret encrypted with requester's pubkey. used to encrypt response data
    bytes encryptedData;
  }

  address public owner;
  address public creditBook;

  mapping(bytes32 => Request) public requests;
  mapping(bytes32 => Response) public responses;

  event NewRequest(address indexed provider, address indexed from, bytes32 indexed id, bytes32 commit);
  event NewResponse(bytes32 indexed id);

  function OrderBook() {
    owner = msg.sender;
  }

  function setCreditBook(address addr) external onlyowner {
    creditBook = addr;
  }

  // TODO: request timeout, refund on timeout
  function submitRequest(bytes32 commit) external {
    address provider;
    bytes32 user;
    uint16  category;
    uint16  state;
    uint256 fee;
    uint256 timestamp;
    (provider, user, category, state, fee, timestamp) = CreditBook(creditBook).records(commit);

    if(provider == 0x0) throw;
    if(msg.value < fee) throw; // TODO: should we refund extra fee?

    bytes32 id = sha3(msg.sender, commit);
    if(requests[id].commit != bytes32(0x0)) throw;

    requests[id] = Request(provider, msg.sender, commit);
    NewRequest(provider, msg.sender, id, commit);
  }

  function submitResponse(bytes32 id, bytes32 encryptedSecret, bytes encryptedData) external {
    if(requests[id].commit == bytes32(0x0)) throw;
    if(encryptedSecret == bytes32(0x0)) throw;

    Request req = requests[id];
    if(req.provider != msg.sender) throw;

    responses[id] = Response(encryptedSecret, encryptedData);
    NewResponse(id);

    // TODO: transfer fee to Payment contract
  }

}
