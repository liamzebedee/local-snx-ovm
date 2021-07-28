#!/usr/bin/env bash
set -ex

# For account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
export HARDHAT_ACCOUNT_1_PRIVKEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

cd projects/synthetix/

# Fund local account with SNX.
node_modules/.bin/hardhat get-snx-local-l2 --account 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --provider http://localhost:8545 --snx-network local --private-key $HARDHAT_ACCOUNT_1_PRIVKEY