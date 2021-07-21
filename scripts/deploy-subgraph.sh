#!/usr/bin/env bash
cd projects/synthetix-subgraph/

npm i
npm link ../synthetix

npx graph create --node http://localhost:8020/ synthetixio-team/optimism-local-general

export SNX_NETWORK=optimism-local
export GRAPH_NODE_URL=http://localhost:8020/
export IPFS_NODE_URL=http://localhost:5001/
export THEGRAPH_SNX_ACCESS_TOKEN="0"

npm run build optimism-local general
npm run deploy optimism-local general