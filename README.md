# Nevermore

Social credit information system based on blockchain.

## Description

We want to build a system for consortium of credit institutions to share credit information securely and efficiently.

For more:

* [Background (Chinese)](doc/Background.md)
* [Why blockchain? (Chinese)](doc/Why-Blockchain.md)

## Features

* Only meta data on chain, details controlled by consortium member
* Credit data is guranteed to be provider's own data
* Pay to query
* Credit investigator pays provider for each data item
* Credit investigator must become consortium member and share data before query
* Auditing system ensures information authenticity
* Economic incentivization for good behave

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
