import 'owned';
import 'mortal';

contract CreditBook is owned, mortal {

  struct Record {
    bytes32 identity;
    uint16 category;
    uint16 state;
    uint256 fee;
    uint256 timestamp;
    bytes32 commit;
  }

  address public owner;

  Record[] public records;

  event NewRecord(bytes32 indexed user, uint16 indexed category, uint16 indexed state, uint256 fee, uint256 timestamp, uint256 id);

  function CreditBook() {
    owner = msg.sender;
  }

  function submit(bytes32 user, uint16 category, uint16 state, uint256 fee, uint256 timestamp, bytes32 commit) external {
    records.push(Record(user, category, state, fee, timestamp, commit));
    NewRecord(user, category, state, fee, timestamp, records.length-1);
  }

}
