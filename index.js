require('dotenv').config()
const Web3 = require("web3");

const chainId = 8453;
const web3RpcUrl = 'https://mainnet.base.org';
const web3 = new Web3(web3RpcUrl);
const broadcastApiUrl = "https://api.1inch.dev/tx-gateway/v1.1/" + chainId + "/broadcast";
const apiBaseUrl = "https://api.1inch.dev/swap/v6.0/" + chainId;
const headers = { headers: { Authorization: `Bearer ${process.env.INCH_API_KEY}`, accept: "application/json" } };

let privatekey = process.env.PRIVATE_KEY;
let walletAddress = '0x9efc025f46f77003C71cce8E670FB9cCEd89fee0';

let aeroTokenAddress = '0x940181a94a35a4569e4529a3cdfb74e38fd98631';
let targetWalletAddresses = [walletAddress] // include any addresses you want here

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkContract(startBlock) {
    let res = await fetch(`https://api.basescan.org/api?module=account&action=txlist&address=${aeroTokenAddress}&startblock=${startBlock}&endblock=99999999&page=1&offset=10&sort=desc&apikey=${process.env.BASESCAN_API_KEY}`)
    let r = await res.json()
    for (let i = 0; i < r.result.length; i++) {
        if (r.result[i].functionName === 'approve(address spender,uint256 amount)') { // check if it's an approve
            if (targetWalletAddresses.includes(r.result[i].from)) { // check whether it's one of our target addresses
                await dumpTokens()
                break
            }
        }
    }
    let lastBlock = r.result[0].blockNumber
    await sleep(5000) // check every 5s
    await checkContract(lastBlock)
}

async function dumpTokens() {
    const swapParams = {
        src: aeroTokenAddress, // Token address of AERO
        dst: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", // Token address of USDc
        amount: "100000000000000000", // Amount of sellToken to swap (in wei) (could query your balance from the token contract or just hardcode it)
        from: walletAddress,
        slippage: 1, // Maximum acceptable slippage percentage for the swap (e.g., 1 for 1%)
        disableEstimate: false, // Set to true to disable estimation of swap details
        allowPartialFill: false // Set to true to allow partial filling of the swap order
    };


    async function buildTxForSwap(swapParams) {
        const url = apiRequestUrl("/swap", swapParams);

        // Fetch the swap transaction details from the API
        return fetch(url, headers)
            .then((res) => res.json())
            .then((res) => res.tx);
    }

    const swapTransaction = await buildTxForSwap(swapParams);
    console.log("Transaction for swap: ", swapTransaction);

    const swapTxHash = await signAndSendTransaction(swapTransaction);
    console.log("Swap tx hash: ", swapTxHash);
}

function apiRequestUrl(methodName, queryParams) {
    return apiBaseUrl + methodName + "?" + new URLSearchParams(queryParams).toString();
}

// Post raw transaction to the API and return transaction hash
async function broadCastRawTransaction(rawTransaction) {
    return fetch(broadcastApiUrl, {
        method: "post",
        body: JSON.stringify({ rawTransaction }),
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.INCH_API_KEY}` }
    })
        .then((res) => res.json())
        .then((res) => {
            return res.transactionHash;
        });
}

// Sign and post a transaction, return its hash
async function signAndSendTransaction(transaction) {
    const { rawTransaction } = await web3.eth.accounts.signTransaction(transaction, privateKey);

    return await broadCastRawTransaction(rawTransaction);
}


checkContract(12565056)