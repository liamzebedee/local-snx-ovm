# synthetix-local-protocol-setup

## Overview

This is a WIP to integrate the UI and smart contract engineering into one cohesive flow. L2-only for now, though quite easy to get running for L2 if you're curious.

Components to a local setup:

 * Synthetix contracts (synthetix/).
 * Local Optimism setup ("ops node") - which includes an L2 OVM chain and L1 EVM chain.
 * Graph node.
 * Synthetix Subgraph.
 * JS Monorepo.
 * Dapps: Kwenta, Staking.
 * Price oracle.
 * Futures keepers.

Each of these projects are setup into the `projects/` subfolder using Git submodules. 

NOTE: I had to make a lot of modifications to all of the above. There are still unmerged PR's, tracked in the [epic here](https://github.com/Synthetixio/issues/issues/209).

## Install.

```sh
# Clone all above projects.
git submodule update --recursive

# Protocol
./scripts/start-optimism-ops.sh
./scripts/deploy-protocol.sh

# Graph
./scripts/start-graph.sh
./scripts/deploy-subgraph.sh

# Oracle.
./scripts/start-oracle.sh

# JS/Dapps
./scripts/link-dapps.sh
```

Now you can run the dapps:

```sh
# Kwenta
cd projects/kwenta
npm run dev

# Staking
cd projects/staking
npm run dev
```

### Graph node.

#### Build on M1.

For M1 macs, the docker image does not work, so you must go through some manual steps. These will be detailed more later, DM me for details.

#### Synthetix subgraph.

Currently only the `general` subgraph is built and deployed.

### Dapps.

Kwenta and Staking are contained within the `projects/` subfolders respectively. They have been linked to the local `synthetix` package and the `js-monorepo` packages, such that they can access local artifacts.

## DevEx tooling.

### Status check.

The status script returns useful info of the status of various projects.

 1. Run `npm install` in this repo.
 2. Run `node src/status.js`. It will output something like: 

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


## Troubleshooting and tips.

### Local OVM accounts.

The OVM geth node has no notion of locally unlocked accounts. All transactions must be signed by a private key. The local OVM ops node uses the same Hardhat HD wallet mnemonic for accounts. These are the first two:

```sh
# Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
# Key:     0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Account #1: 0xB64fF7a4a33Acdf48d97dab0D764afD0F6176882
# Key:     0x8722B4BE1CFBBFF1BF7DC8430650A98256640DB8200F9690269D974E96CC52C3
```

The local account is minted some SNX during deployment using the `get-snx-local-l2` hardhat task.

### JSON-RPC Errors.

Commonly while deploying to the L2 ops node, I encountered JSON RPC errors. I don't know why, though restarting the local L2 node fixes it -

```sh
./scripts/restart-l2.sh
```