#!/usr/bin/env bash
set -ex

cd projects/futures-trader/

npm i
npm link ../synthetix

NETWORK=local ETH_HDWALLET_MNEMONIC='height phrase soldier tiny stage suspect virtual power alert baby nothing borrow camera pulse agent' node src/ run -p ws://localhost:8546