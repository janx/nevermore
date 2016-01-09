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

  event NewRequest(uint256 indexed id, bytes32 indexed commit, address indexed provider, uint256 fee);

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
     address provider = CreditBook(creditBook).getProvider(commit);
     if(provider == 0x0) throw;

     requests.push(Request(commit, provider, msg.sender));
     NewRequest(requests.length-1, commit, provider, msg.value);
  }

}
