import fetch from 'node-fetch'
import { URLSearchParams } from 'url'

const sendRequest: () => Promise<void> = async () => {
  const url = 'https://api.etherscan.io/api'
  const params = {
    module: 'proxy',
    action: 'eth_blockNumber'
  }
  const searchParams = new URLSearchParams(params)
  const response = await fetch(`${url}?${searchParams.toString()}`)
  const data = await response.json()
  console.info(data)
}

export default sendRequest
