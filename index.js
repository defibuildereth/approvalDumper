require('dotenv').config()

let privatekey = process.env.PRIVATE_KEY


let aeroTokenAddress = '0x940181a94a35a4569e4529a3cdfb74e38fd98631'
let targetWalletAddress = '0x9efc025f46f77003C71cce8E670FB9cCEd89fee0'


async function checkContract() {
    let res = await fetch(`https://api.basescan.org/api?module=account&action=txlist&address=0x940181a94a35a4569e4529a3cdfb74e38fd98631&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${process.env.BASESCAN_API_KEY}`)
    let r = await res.json()
    console.log(r)
}

async function botGo() {
    console.log('running')


}

checkContract()