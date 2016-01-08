import 'owned';
import 'mortal';

contract OrderBook is owned, mortal {

  struct Request {
    uint256 id;
    address provider;
    address from;
  }

  struct Response {
  }

  address public owner;

  Request[] public requests;

  event NewRequest(uint256 indexed id, address indexed provider, uint256 fee);

  function OrderBook() {
    owner = msg.sender;
  }

  function request(uint256 id) {
  }

}
