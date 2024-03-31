require('dotenv').config()
const providers = require("./providers.js")

let privatekey = process.env.PRIVATE_KEY

let aeroTokenAddress = '0x940181a94a35a4569e4529a3cdfb74e38fd98631'
let usdcTokenAddress = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913'
let targetWalletAddress = '0x9efc025f46f77003C71cce8E670FB9cCEd89fee0'

let condition = {
    address: usdcTokenAddress
}

async function botGo() {
    console.log('running')

    providers.BASE.on(condition, 
        (event) => {
            try {
                console.log(event)
            }
            catch(err) {
                console.log(error)
            }
        })
}

botGo()