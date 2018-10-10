BigNumber = require("bignumber.js")
module.exports = function(web3, safe, target, signer) { 
    typedData = {
        types: {
            EIP712Domain: [
                { type: "address", name: "verifyingContract" }
            ],
            SafeTx: [
                { type: "address", name: "to" },
                { type: "uint256", name: "value" },
                { type: "bytes", name: "data" },
                { type: "uint8", name: "operation" },
                { type: "uint256", name: "safeTxGas" },
                { type: "uint256", name: "dataGas" },
                { type: "uint256", name: "gasPrice" },
                { type: "address", name: "gasToken" },
                { type: "address", name: "refundReceiver" },
                { type: "uint256", name: "nonce" },
            ]
        },
        domain: {
            verifyingContract: safe,
        },
        primaryType: "SafeTx",
        message: {
            to: target,
            value: "10000000000000000",
            data: "0x",
            operation: "0",
            safeTxGas: "42671",
            dataGas: "40660",
            gasPrice: "10000000000",
            gasToken: "0x0000000000000000000000000000000000000000",
            refundReceiver: "0x0000000000000000000000000000000000000000",
            nonce: "0"
        }
    }
    web3.currentProvider.sendAsync({
        jsonrpc: "2.0", 
        method: "eth_signTypedData", // eth_signTypedData_v3 for MetaMask
        params: [signer, typedData],
        id: new Date().getTime()
    }, function(err, response) {
        sig = response.result
        console.log()
        console.log("r:", new BigNumber(sig.slice(2, 66), 16).toString(10))
        console.log("s:", new BigNumber(sig.slice(66, 130), 16).toString(10))
        console.log("v:", new BigNumber(sig.slice(130, 132), 16).toString(10))
    });
}