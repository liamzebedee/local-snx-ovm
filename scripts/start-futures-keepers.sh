#!/usr/bin/env bash
set -ex

cd projects/futures-keepers
npm i
npm link ../synthetix

if [ ! -f ./.env ]; then
    echo "# Account #1: 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 (10000 ETH)" >> .env
    echo "ORACLE_PRIVATE_KEY=59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d" >> .env
fi

# Account #1: 0x96D6C55a500782ba07aefb4f620dF2a94CDc7bA7
export ETH_HDWALLET_MNEMONIC='height phrase soldier tiny stage suspect virtual power alert baby nothing borrow camera pulse agent'

NETWORK=local node src/ run -p ws://localhost:8546 --from-block 0 -n 1