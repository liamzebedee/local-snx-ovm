#!/usr/bin/env bash
set -ex

cd projects/synthetix/
npm i
node_modules/.bin/hardhat ops --start --detached