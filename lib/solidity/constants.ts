export const smartAccountVersions = ['v1.3.0', 'v1.4.1'] // Older versions don't support hardhat
export const modulesVersions = {
  '4337': ['v0.3.0-1'], // The older version (0.2.0) has a different file structure
  allowance: ['v0.1.1'],
  passkey: ['v0.2.1'],
  recovery: ['v0.1.0']
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
  'address payable': '0x...',
  'address[]': '["0x..."]',
  uint8: 0,
  uint16: 0,
  uint32: 0,
  uint48: 0,
  uint96: 0,
  uint256: '0',
  'uint256[]': '[0]',
  'struct PackedUserOperation': `PackedUserOperation`,
  'struct SafeWebAuthnSharedSigner.Signer': 'Signer',
  'struct SocialRecoveryModule.RecoveryRequest': 'RecoveryRequest',
  'struct SocialRecoveryModule.SignatureData[]': '[SignatureData]',
  'P256.Verifiers': 'Verifiers',
  bytes: '"0x..."',
  'enum Enum.Operation': '0',
  bytes32: '"0x..."',
  bool: 'true',
  string: '"..."',
  'contract ISafe': 'ISafe',
  'contract IP256Verifier': 'IP256Verifier'
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

export const modulesCategories = {
  '4337': {
    setup: ['domainSeparator', 'enableModules', 'nonce', 'threshold'],
    operations: [
      'executeUserOp',
      'executeUserOpWithErrorString',
      'getOperationHash',
      'validateUserOp'
    ]
  },
  allowance: {
    setup: ['getChainId'],
    allowances: [
      'deleteAllowance',
      'getTokenAllowance',
      'resetAllowance',
      'setAllowance'
    ],
    delegates: ['addDelegate', 'getDelegates', 'removeDelegate'],
    transactions: [
      'executeAllowanceTransfer',
      'execTransactionFromModule',
      'getTokens',
      'generateTransferHash'
    ]
  },
  passkey: {
    setup: ['configure', 'constructor', 'fallback', 'getConfiguration'],
    signers: ['createSigner', 'getSigner'],
    signatures: [
      'encodeSigningMessage',
      'isValidSignature',
      'isValidSignatureForSigner',
      'verifySignature',
      'verifySignatureAllowMalleability'
    ]
  },
  recovery: {
    setup: [
      'changeThreshold',
      'domainSeparator',
      'getChainId',
      'nonce',
      'threshold'
    ],
    guardians: [
      'addGuardianWithThreshold',
      'getGuardians',
      'guardiansCount',
      'hasGuardianApproved',
      'isGuardian',
      'revokeGuardianWithThreshold',
      'validateGuardianSignature'
    ],
    recovery: [
      'confirmRecovery',
      'cancelRecovery',
      'encodeRecoveryData',
      'executeRecovery',
      'finalizeRecovery',
      'getRecoveryApprovals',
      'getRecoveryHash',
      'getRecoveryRequest',
      'invalidateNonce',
      'multiConfirmRecovery'
    ]
  }
}
