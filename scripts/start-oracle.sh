#!/usr/bin/env bash
set -ex

cd projects/optimistic-oracle
npm i
npm link ../synthetix

if [ ! -f ./.env ]; then
    echo "# Account #1: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)" >> .env
    echo "ORACLE_PRIVATE_KEY=ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" >> .env
fi

NETWORK=local node run.js