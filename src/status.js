require('dotenv').config()

const { resolve, dirname } = require("path")
const fs = require('fs')
const { gray, green, cyan, red, bgRed, yellow } = require('chalk');
const { formatEther, formatBytes32String, toUtf8String } = require('ethers').utils;
const ethers = require('ethers')
const appDir = dirname(require.main.filename);

const {
    SYNTHETIX_PATH,
    SYNTHETIX_SUBGRAPH_PATH,
    JS_MONOREPO_PATH,
    KWENTA_PATH,
    STAKING_PATH,
    SNX_NETWORK,

    GRAPH_NODE_URL,
    // L1_CHAIN_URL,
    // L2_CHAIN_URL
} = process.env

const log = console.log

const logSection = sectionName => {
    console.log(green(`\n=== ${sectionName}: ===`));
};

const logItem = (itemName, itemValue, indent = 1, color = undefined) => {
    const hasValue = itemValue !== undefined;
    const spaces = '  '.repeat(indent);
    const name = cyan(`* ${itemName}${hasValue ? ':' : ''}`);
    const value = hasValue ? itemValue : '';

    if (color) {
        console.log(color(spaces, name, value));
    } else {
        console.log(spaces, name, value);
    }
};

const fileExists = async path => !!(await fs.promises.stat(path).catch(e => false));

function printTimestamp() {

}

async function chainStatus({ endpoint, snxNetwork, useOvm }) {
    let provider
    let isOnline = false
    let chainId = '?'
    let lastDeployment
    let latestBlockTimestamp

    try {
        provider = new ethers.providers.JsonRpcProvider(endpoint)
        const network = await provider.getNetwork()
        chainId = network.chainId
        isOnline = true
        const latestBlock = await provider.getBlock('latest')
        latestBlockTimestamp = (new Date(latestBlock.timestamp * 1000)).toLocaleString()
    } catch(err) {
        if (!(err.code == 'NETWORK_ERROR')) throw err
    }

    if (isOnline) {
        // This supports networks with dumb names like kovan-futures-ovm. 
        // I wonder who named that one... (it was me).
        const networkTarget = snxNetwork + ((useOvm && !snxNetwork.includes('ovm')) ? '-ovm' : '')
        const deploymentPath = resolve(`${SYNTHETIX_PATH}/publish/deployed/${networkTarget}/deployment.json`)

        if (await fileExists(deploymentPath)) {
            const deployment = require(deploymentPath)

            if (Object.keys(deployment.targets).length) {
                let mostRecentlyDeployedTarget = Object.values(deployment.targets).reduce((prev, target) => {
                    let timestamp = target.timestamp
                    if (!timestamp) return prev

                    if ((new Date(timestamp)) > (new Date(prev.timestamp))) {
                        return target
                    }

                    return prev
                })

                // Now check the contract still exists, as the chain may have been restarted, and state lost.
                const code = await provider.getCode(mostRecentlyDeployedTarget.address)

                if (code !== '0x') {
                    lastDeployment = (new Date(mostRecentlyDeployedTarget.timestamp)).toLocaleString()
                }
            }
        }
    } else {
        lastDeployment = 'n/a, node is offline.'
    }

    logItem('Endpoint', endpoint)
    logItem('Online', isOnline ? '✅' : '❌')
    logItem('Chain ID', chainId)
    logItem('Last deployment', lastDeployment || yellow('Never'))
    logItem('Latest block', latestBlockTimestamp || yellow('Never'))
}

const bent = require('bent')

async function graphStatus({ endpoint }) {
    let isOnline
    try {
        // TODO: improve this test of whether graph is online.
        // Ideally, it should perform a graphql query.
        const response = await bent('OPTIONS', 'string')(endpoint);
        isOnline = true
    } catch(err) {
        if (!(err.code == 'ECONNREFUSED')) throw err
    }

    logItem('Endpoint', endpoint)
    logItem('Online', isOnline ? '✅' : '❌')
}

async function run() {
    console.log(`synthetix (network: ${SNX_NETWORK}, ${gray(resolve(SYNTHETIX_PATH))})`)

    logSection('Optimism node')
    await chainStatus({ endpoint: 'http://localhost:8545', snxNetwork: SNX_NETWORK, useOvm: true })

    logSection('L1 node')
    await chainStatus({ endpoint: 'http://localhost:9545', snxNetwork: SNX_NETWORK, useOvm: false })

    logSection('Graph node')
    await graphStatus({ endpoint: GRAPH_NODE_URL })
}

run().catch(err => {
    throw err
})
