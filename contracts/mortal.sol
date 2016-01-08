import "owned";

contract mortal is owned {
  function kill() onlyowner {
      if (msg.sender == owner) suicide(owner);
    }
}
