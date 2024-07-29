import Safe from '@safe-global/protocol-kit'

const apiKit = new SafeApiKit({
  chainId: 11155111n
})

const delegates = await apiKit.getSafeDelegates({
  safeAddress: '0xb53a6b6f67847cff94fdb94b90345cb45a2c7301'
})

console.log(delegates)
