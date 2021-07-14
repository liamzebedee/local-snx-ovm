# snx-local-ovm

## Overview

This is a WIP to integrate the UI and smart contract engineering into one cohesive flow.

Components to a local setup:

 * Synthetix contracts (synthetix/).
 * Local Optimism setup ("ops node") - which includes an L2 OVM chain and L1 EVM chain.
 * Graph node.
 * Synthetix Subgraph.
 * JS Monorepo.
 * Dapps: Kwenta, Staking.

## Install.

### Synthetix.

```sh
# // Deterministic account #0 when using `npx hardhat node`
#    owner: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
export LOCAL_OVM_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Protocol
npm link
git checkout local-l2

## Runs the Optimism nodes.
npx hardhat ops

## Deploy contracts.
npx harhdat test:integration:l2 --compile --deploy
```

### Graph node.

#### Build.

```sh
# Graph node.
git clone https://github.com/graphprotocol/graph-node
cd graph-node/
cd docker/
docker-compose up -d
```

For M1 macs, the docker image does not work, so you must go through some manual steps:

```
# IPFS
ipfs daemon

# Install and run Postgres.

# Run graph-node.
./target/debug/graph-node \
  --postgres-url postgresql://postgres:@localhost:5432/graph-node \
  --ethereum-rpc optimism-local:http://localhost:8545 \
  --ipfs 127.0.0.1:5001
```

#### Synthetix subgraph.

```sh
# Subgraph.
git clone https://github.com/Synthetixio/synthetix-subgraph
cd synthetix-subgraph/
git checkout local-ovm-2
npm i
npm link ../synthetix

npx graph create --node http://localhost:8020/ synthetixio-team/optimism-local-general

SNX_NETWORK=optimism-local npm run build optimism-local general
SNX_NETWORK=optimism-local npm run deploy optimism-local general
```

### js-monorepo

```sh
# js-monorepo
git checkout local-ovm/base
npm i

# @synthetixio/contracts-interface
cd packages/contracts-interface
npm link ../../../synthetix

cd ../..
# build repo
npm run build
```

### Dapps.

```sh
# Kwenta
git checkout local-ovm/base
npm i
npm link ../js-monorepo/packages/contracts-interface
npm run dev

# Staking
git checkout local-ovm
npm i
npm link ../js-monorepo/packages/contracts-interface
```

## DevEx tooling.

 1. Configure the `.env`.
    ```
    cp .env.example .env
    # Configure the local paths to the above subprojects.
    ```
 2. Run `npm install`.
 3. Run `node src/status.js`. It will output something like: 

    ```sh
    (base) ➜  local-ovm-ui node src/status.js
    synthetix (/Users/liamz/Documents/Work/2021_Synthetix/code/synthetix)

    === L1 node: ===
    * Endpoint: http://localhost:9545
    * Online: ✅
    * Chain ID: 31337
    * Last deployment: Never

    === L2 node: ===
    * Endpoint: http://localhost:8545
    * Online: ✅
    * Chain ID: 420
    * Last deployment: Never

    === Graph node: ===
    * Endpoint: http://localhost:5001
    * Online: ❌
   ```
