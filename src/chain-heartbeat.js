require('dotenv').config()

const ethers = require('ethers')

const log = console.log

async function heartbeat({ ctx }) {
    const tx = await ctx.signer.sendTransaction({
        to: '0x' + '1'.repeat(40),
        value: 1,
    });
    await tx.wait()
    process.stdout.write('.')
}

async function run() {
    const PROVIDER_URL = 'http://localhost:8545'
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL)
    // # For account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
    // export HARDHAT_ACCOUNT_1_PRIVKEY = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
    const signer = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider)
    
    const ctx = {
        provider,
        signer
    }
    
    console.log(`Running heartbeat for chain at ${PROVIDER_URL}`)
    
    setInterval(() => heartbeat({ ctx }), 10000)
    heartbeat({ ctx })

    await new Promise((res, rej) => {})
}

run().catch(err => {
    throw err
})
