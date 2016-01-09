#!/usr/bin/expect -f

set key [lindex $argv 0];
set password [lindex $argv 1];

spawn hydrachain -d node account import $key
expect "Password to encrypt private key:"  {send "$password\n"}
expect "Repeat for confirmation:" {send "$password\n"}
interact
