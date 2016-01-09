import 'owned';
import 'mortal';

contract CreditBook is owned, mortal {

  struct Record {
    address provider;
    bytes32 identity;
    uint16 category;
    uint16 state;
    uint256 fee;
    uint256 timestamp;
    bytes32 commit;
  }

  address public owner;

  bytes32[] index;
  mapping(bytes32 => Record) records;

  event NewRecord(bytes32 indexed user, uint16 indexed category, uint16 indexed state, uint256 fee, uint256 timestamp, address provider, uint256 id);

  function CreditBook() {
    owner = msg.sender;
  }

  function size() constant returns (uint256) {
    return index.length;
  }

  function submit(bytes32 user, uint16 category, uint16 state, uint256 fee, uint256 timestamp, bytes32 commit) external {
    if(user == bytes32(0x0)) throw;
    if(timestamp == 0) throw;
    if(records[commit].timestamp != 0) throw; // commit must be unique

    index.push(commit);
    records[commit] = Record(msg.sender, user, category, state, fee, timestamp, commit);

    NewRecord(user, category, state, fee, timestamp, msg.sender, index.length-1);
  }

}
