require('dotenv')

const { resolve, dirname } = require("path")
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

    // GRAPH_NODE_URL,
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

async function chainStatus({ endpoint, snxNetwork, useOvm }) {
    let provider
    let isOnline = false
    let chainId = '?'
    let lastDeployment

    try {
        provider = new ethers.providers.JsonRpcProvider(endpoint)
        const network = await provider.getNetwork()
        chainId = network.chainId
        isOnline = true
    } catch(err) {
        if (!(err.code == 'NETWORK_ERROR')) throw err
    }

    if (isOnline) {
        const deployment = require(resolve(`${SYNTHETIX_PATH}/publish/deployed/${snxNetwork}${useOvm ? '-ovm' : ''}/deployment.json`))
        if (Object.keys(deployment.targets).length) {
            let mostRecentlyDeployedTarget = Object.values(deployment.targets).reduce((prev, target) => {
                let timestamp = target.timestamp
                if(!timestamp) return prev

                if ((new Date(timestamp)) > (new Date(prev.timestamp))) {
                    return target   
                }
                
                return prev
            })
            
            // Now check the contract still exists, as the chain may have been restarted, and state lost.
            const code = await provider.getCode(mostRecentlyDeployedTarget.address)
            if (code !== '0x') {
                lastDeployment = mostRecentlyDeployedTarget.timestamp
            }
        }
    }

    logItem('Endpoint', endpoint)
    logItem('Online', isOnline ? '✅' : '❌')
    logItem('Chain ID', chainId)
    logItem('Last deployment', lastDeployment || yellow('Never'))
}

const bent = require('bent')

async function graphStatus({ endpoint }) {
    let isOnline
    try {
        const response = await bent('GET', 'json')(endpoint);
        
    } catch(err) {
        if (!(err.code == 'ECONNREFUSED')) throw err
    }

    logItem('Endpoint', endpoint)
    logItem('Online', isOnline ? '✅' : '❌')
}

function checkSynthetixLinked(path) {
    
}

async function run() {
    console.log(`synthetix (${gray(resolve(SYNTHETIX_PATH))})`)

    logSection('L1 node')
    await chainStatus({ endpoint: 'http://localhost:9545', snxNetwork: SNX_NETWORK, useOvm: false })
    // logItem('Managed', !L1_CHAIN_URL)

    logSection('L2 node')
    await chainStatus({ endpoint: 'http://localhost:8545', snxNetwork: SNX_NETWORK, useOvm: true })
    // logItem('Managed', !L2_CHAIN_URL)

    logSection('Graph node')
    await graphStatus({ endpoint: 'http://localhost:5001' })
}

run().catch(err => console.error(err.toString()))

// Chain
// =====

// L1 Node
//     ENDPOINT Online
//     Chain ID
//     Last deployment XXX

// L2 Node
//     ENDPOINT Online
//     Chain ID
//     Last deployment XXX

// Graph node
//     ENDPOINT Online
//     Last deployment

// Staking
    // Using local synthetix via `npm link`? N.

// Kwenta
    // Using local synthetix via `npm link`? N.

