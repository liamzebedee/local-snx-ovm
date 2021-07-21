
#!/bin/bash
cd projects/graph-node

# IPFS
ipfs daemon &

# Install and run Postgres.

# Run graph-node.
./target/debug/graph-node \
  --postgres-url postgresql://postgres:@localhost:5432/graph-node \
  --ethereum-rpc optimism-local:http://localhost:8545 \
  --ipfs 127.0.0.1:5001