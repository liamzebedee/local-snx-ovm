#!/usr/bin/env bash
set -ex

# 
# ----------------- js-monorepo ------------------
# 

pushd projects/js-monorepo/
npm i

# @synthetix/contracts-interface
cd packages/contracts-interface
npm link ../../../synthetix

# npm run build
popd

# 
# ------------------ Kwenta ------------------
# 

pushd projects/kwenta
npm i
npm link ../js-monorepo/packages/contracts-interface
popd

# 
# ------------------ Staking ------------------
# 

pushd projects/staking
npm i
npm link ../js-monorepo/packages/contracts-interface
popd