export const smartAccountVersions = ['v1.3.0', 'v1.4.1'] // Older versions don't support hardhat
export const modulesVersions = {
  '4337': ['v0.3.0'],
  allowances: ['v0.1.1'],
  passkey: ['v0.2.1'],
  recovery: ['v0.1.0', 'v0.2.0']
}
export const ignoredFunctions = [
  'checkAfterExecution',
  'checkTransaction',
  'getModules',
  'masterCopy',
  'VERSION',
  'proxyCreated'
]
export const sampleValues = {
  address: '0x...',
  'address[]': '["0x..."]',
  uint256: '0',
  'uint256[]': '[0]',
  bytes: '"0x..."',
  'enum Enum.Operation': '0',
  bytes32: '"0x..."',
  bool: 'true',
  string: '"..."'
}
export const smartAccountCategories = {
  setup: [
    'createChainSpecificProxyWithNonce',
    'createProxyWithCallback',
    'createProxyWithNonce',
    'domainSeparator',
    'getChainId',
    'setup'
  ],
  owners: [
    'addOwnerWithThreshold',
    'changeThreshold',
    'getOwners',
    'getThreshold',
    'isOwner',
    'removeOwner',
    'swapOwner'
  ],
  transactions: [
    'encodeTransactionData',
    'execTransaction',
    'getTransactionHash',
    'multiSend',
    'onERC721Received',
    'onERC1155Received',
    'onERC1155BatchReceived',
    'simulate',
    'simulateAndRevert',
    'tokensReceived',
    'requiredTxGas'
  ],
  modules: [
    'enableModule',
    'disableModule',
    'execTransactionFromModule',
    'execTransactionFromModuleReturnData',
    'getModulesPaginated',
    'isModuleEnabled'
  ],
  guards: ['setGuard', 'setModuleGuard'],
  fallbackHandler: ['fallback', 'receive', 'setFallbackHandler'],
  signatures: [
    'approveHash',
    'checkNSignatures',
    'checkSignatures',
    'encodeMessageDataForSafe',
    'getMessageHash',
    'getMessageHashForSafe',
    'isValidSignature',
    'signMessage',
    'signedMessages'
  ],
  utilities: [
    'getStorageAt',
    'performCreate',
    'performCreate2',
    'proxyCreationCode',
    'supportsInterface'
  ]
}
