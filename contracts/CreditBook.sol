import 'owned';
import 'mortal';

contract CreditBook is owned, mortal {

  struct RecordHeader {
    bytes32 id;
    uint16 category;
    uint16 state;
    uint256 fee;
    uint256 timestamp;
  }

  address public owner;

  mapping(bytes32 => RecordHeader) records;

  function CreditBook() {
    owner = msg.sender;
  }

  function submit(bytes32 id, uint16 category, uint16 state, uint256 fee, uint256 timestamp) {
  }
}
