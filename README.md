# Nevermore

![](https://github.com/janx/nevermore/blob/master/app/images/screenshot.png)

Social credit information system based on blockchain.

## POC Design

* Storage layer - Shared database on [hydrachain](https://github.com/HydraChain/hydrachain), a private blockchain with [Ethereum](https://github.com/ethereum/go-ethereum) comptabile smart contract.
* Data layer - Javascripts, communication channel between storage and domain.
* Domain layer - Javascripts, application logic.
* Presentation layer - Build with [Angular](https://angularjs.org/).

## Development Setup

In project root:

```
cd ./hydrachain
./import_keys.sh # import accounts for development and testing
./start_cluster.sh # start hydrachain nodes
cd ..

truffle deploy
truffle serve
```
