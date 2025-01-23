import SafeApiKit from '@safe-global/api-kit'

const apiKit = new SafeApiKit({
  chainId: 534352n
})

const data = await apiKit.decodeData(
  '0xa9059cbb0000000000000000000000005298a93734c3d979ef1f23f78ebb871879a21f220000000000000000000000000000000000000000000000008ac7230489e80000'
)

console.log(data)
