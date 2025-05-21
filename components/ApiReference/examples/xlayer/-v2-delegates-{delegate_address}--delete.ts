import SafeApiKit from '@safe-global/api-kit'
import { ethers } from 'ethers' // Ethers v6

const apiKit = new SafeApiKit({
  chainId: 196n,
  txServiceApiKey: 'YOU_API_KEY'
})

const provider = new ethers.JsonRpcProvider(
  'https://eth-sepolia.public.blastapi.io'
)

const signer = new ethers.Wallet(
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  provider
)

const response = await apiKit.removeSafeDelegate({
  delegateAddress: '0x3A16E3090e32DDeD2250E862B9d5610BEF13e93d',
  delegatorAddress: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  signer
})

console.log(response)
