import 'owned';
import 'mortal';
import 'CreditBook';

contract OrderBook is owned, mortal {

  struct Request {
    bytes32 commit;
    address provider;
    address from;
  }

  struct Response {
  }

  address public owner;
  address public creditBook;

  Request[] public requests;

  event NewRequest(bytes32 indexed commit, address indexed provider, address indexed from, uint256 id, uint256 fee);

  function OrderBook() {
    owner = msg.sender;
  }

  function setCreditBook(address addr) external onlyowner {
    creditBook = addr;
  }

  function size() constant returns (uint256) {
    return requests.length;
  }

  function request(bytes32 commit) external {
    address provider;
    bytes32 user;
    uint16  category;
    uint16  state;
    uint256 fee;
    uint256 timestamp;
    (provider, user, category, state, fee, timestamp) = CreditBook(creditBook).records(commit);

    if(provider == 0x0) throw;
    if(msg.value < fee) throw; // TODO: should we refund extra fee?

    requests.push(Request(commit, provider, msg.sender));
    NewRequest(commit, provider, msg.sender, requests.length-1, msg.value);
  }

}
