const ethers = require('ethers');
const { gray, blue, red, green, yellow } = require('chalk');

const DEFAULT_GAS_PRICE = '0';
const snx = require('synthetix')
const {
    utils: { parseEther, formatEther },
} = ethers;
const _ = require('lodash')

class Trader {
    constructor({
        proxyFuturesMarket: proxyFuturesMarketAddress,
        exchangeRates: exchangeRatesAddress,
        signerPool,
        provider,
        network,
    }) {
        // Get ABIs.
        const FuturesMarketABI = snx.getSource({ network, contract: "FuturesMarket", useOvm: true }).abi
        const ExchangeRatesABI = snx.getSource({ network, contract: "ExchangeRatesWithoutInvPricing", useOvm: true }).abi

        // The index.
        this.currentExchangeRatesRound = null;

        // A FIFO queue of blocks to be processed.
        this.blockQueue = [];

        const futuresMarket = new ethers.Contract(
            proxyFuturesMarketAddress,
            FuturesMarketABI,
            provider
        );
        this.futuresMarket = futuresMarket;

        const exchangeRates = new ethers.Contract(exchangeRatesAddress, ExchangeRatesABI, provider);
        this.exchangeRates = exchangeRates;

        this.blockTip = null;
        this.provider = provider;
        this.signerPool = signerPool
    }

    async run() {
        this.currentExchangeRatesRound = await this.futuresMarket.currentRoundId();
        
        console.log(gray(`Starting trading loop`));

        console.log(`Listening for events on FuturesMarket [${this.futuresMarket.address}]`);
        this.provider.on('block', async blockNumber => {
            if (!this.blockTip) {
                // Don't process the first block we see.
                this.blockTip = blockNumber;
                return;
            }

            console.log(gray(`New block: ${blockNumber}`));
            this.blockQueue.push(blockNumber);
        });

        setInterval(() => this.yolotrade(), 10000)

    }

    async yolotrade() {
        const x = Math.random()
        const margin = parseEther('200') // 200 sUSD
        const leverage = parseEther('2').mul(parseEther("" + x)).div(parseEther('1'))
        
        console.log(`Submitting order margin=${formatEther(margin)} leverage=${formatEther(leverage)}`)
        
        await this.signerPool.withSigner(async signer => {
            try {
                const tx = await this.futuresMarket
                    .connect(signer)
                    .modifyMarginAndSubmitOrder(margin, leverage);
                const receipt = await tx.wait(1);
                console.log(`Submitted!`)
            } catch(err) {
                // If it's an unpredictable gas limit, OVM could be reverting.
                if (err.code == 'UNPREDICTABLE_GAS_LIMIT') {
                    const nestedError = _.get(err, 'error.error.message');
                    
                    if (nestedError.includes('Invalid price')) {
                        return
                    }
                }

                console.error(err)
            } 
            
        })
    }
}

module.exports = Trader