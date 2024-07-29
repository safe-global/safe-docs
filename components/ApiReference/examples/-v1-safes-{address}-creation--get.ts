import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 11155111n
})

const safeCreationInfo = await apiKit.getSafeCreationInfo(
  '0x5298A93734C3D979eF1f23F78eBB871879A21F22'
)

console.log(safeCreationInfo)
