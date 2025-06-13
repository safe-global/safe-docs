import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 1101n,
  apiKey: 'YOU_API_KEY'
})

const delegates = await apiKit.getSafeDelegates({
  safeAddress: '0xb53a6b6f67847cff94fdb94b90345cb45a2c7301'
})

console.log(delegates)
