contract owned {

  address owner;

  function owned() {
    owner = msg.sender;
  }

  function changeOwner(address newOwner) onlyowner {
    owner = newOwner;
  }

  modifier onlyowner() {
    if (msg.sender == owner) _
  }

}
