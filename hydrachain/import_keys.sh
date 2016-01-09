#!/bin/sh

echo "***** Import all pre-funded private keys"

read -p "***** Enter password for the new wallet: " password

for key in `find ./private_keys -name '*.key'`
do
	./private_keys/import.sh $key $password
done

echo "***** Done."
