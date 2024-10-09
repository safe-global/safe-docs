import type { PasskeyArgType } from '@safe-global/protocol-kit'

export const useSafeStore = defineStore('safe', {
  state: () => ({
    passkeys: <PasskeyArgType[]>[],
    selectedPasskey: <PasskeyArgType>{},
    safeAddress: <string>'',
    isSafeDeployed: <boolean>false,
    isLoading: <boolean>false,
    userOp: <string>'',
    jiffyLink: <string>'',
    safeLink: <string>''
  }),
  actions: {
    setPasskeys(data: PasskeyArgType[]) {
      this.passkeys = data
    },
    setSelectedPasskey(data: PasskeyArgType) {
      this.selectedPasskey = data
    },
    setSafeAddress(data: string) {
      this.safeAddress = data
    },
    setIsSafeDeployed(data: boolean) {
      this.isSafeDeployed = data
    },
    setIsLoading(data: boolean) {
      this.isLoading = data
    },
    setUserOp(data: string) {
      this.userOp = data
    },
    setSafeLink(data: string) {
      this.safeLink = data
    },
    setJiffyLink(data: string) {
      this.jiffyLink = data
    }
  }
})
