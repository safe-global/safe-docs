import { Safe4337Pack } from '@safe-global/relay-kit'

const safe4337Pack = await Safe4337Pack.init({
  provider,
  bundlerUrl,
  options
})

const userOperation = await safe4337Pack.getUserOperationByHash(userOpHash)
