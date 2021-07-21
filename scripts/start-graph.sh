#!/bin/bash
cd projects/graph-node

cd docker/
# Replace "mainnet" with "optimism-local" network.
sed -i -e "s/ethereum: 'mainnet/ethereum: optimism-local/" docker-compose.yml

# Start IPFS, Postgres, graph-node.
docker-compose up -d