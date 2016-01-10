import 'owned';
import 'mortal';

contract CreditBook is owned, mortal {

  enum Categories { CreditLoan, CollateralLoan, GuaranteedLoan }
  enum States { Applying, Ongoing, Complete }

  struct Record {
    address provider;
    bytes32 identity;
    uint16  category;
    uint16  state;
    uint256 fee;
    uint256 timestamp;
  }

  address public owner;

  //bytes32[] index;
  //mapping(bytes32 => Record) public records;
  address[] record_providers;
  bytes32[] record_identities;
  uint16[]  record_categories;
  uint16[]  record_states;
  uint256[] record_fees;
  uint256[] record_timestamps;
  bytes32[] record_commits;

  mapping(bytes32 => uint256) public commits;

  event NewRecord(bytes32 indexed user, uint16 indexed category, uint16 indexed state, address provider, bytes32 commit);

  function CreditBook() {
    owner = msg.sender;
  }

  function size() constant returns (uint256) {
    return record_commits.length;
  }

  function get(bytes32 commit) constant returns (address, bytes32, uint16, uint16, uint256, uint256) {
    uint256 id = commits[commit];
    return (record_providers[id], record_identities[id], record_categories[id], record_states[id], record_fees[id], record_timestamps[id]);
  }

  function all() constant returns (address[], bytes32[], uint16[], uint16[], uint256[], uint256[], bytes32[]) {
    return (record_providers, record_identities, record_categories, record_states, record_fees, record_timestamps, record_commits);
  }

  function submit(bytes32 user, uint16 category, uint16 state, uint256 fee, uint256 timestamp, bytes32 commit) external {
    if(user == bytes32(0x0)) throw;
    if(timestamp == 0x0) throw;
    if(commits[commit] != 0x0) throw; // commit must be unique

    commits[commit] = record_commits.length;

    record_providers.push(msg.sender);
    record_identities.push(user);
    record_categories.push(category);
    record_states.push(state);
    record_fees.push(fee);
    record_timestamps.push(timestamp);
    record_commits.push(commit);
    //records[commit] = Record(msg.sender, user, category, state, fee, timestamp);

    NewRecord(user, category, state, msg.sender, commit);
  }

}
