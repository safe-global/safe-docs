import {
  getScheduledTransferData,
  getScheduledTransfersExecutor,
  getCreateScheduledTransferAction,
  getExecuteScheduledTransferAction
} from '@rhinestone/module-sdk'

import { SafeSmartAccountClient } from './permissionless'
import abi from '../abi/ScheduleTransfersModule.json'

export interface ScheduledTransferDataInput {
  startDate: number
  repeatEvery: number
  numberOfRepeats: number
  amount: number
  recipient: `0x${string}`
}

export const scheduledTransfersModuleAddress =
  '0xF1aE317941efeb1ffB103D959EF58170F1e577E0'
const sepoliaUSDCTokenAddress = '0x94a9d9ac8a22534e3faca9f4e7f2e2cf85d5e4c8'

export const install7579Module = async (
  safe: SafeSmartAccountClient,
  scheduledTransferInput: ScheduledTransferDataInput
) => {
  const { startDate, repeatEvery, numberOfRepeats, amount, recipient } =
    scheduledTransferInput
  const scheduledTransfer = {
    startDate,
    repeatEvery,
    numberOfRepeats,
    token: {
      token_address: sepoliaUSDCTokenAddress as `0x${string}`,
      decimals: 6
    },
    amount,
    recipient
  }

  const executionData = getScheduledTransferData({
    scheduledTransfer
  })

  const scheduledTransfersModule = getScheduledTransfersExecutor({
    executeInterval: repeatEvery,
    numberOfExecutions: numberOfRepeats,
    startDate,
    executionData
  })

  const txHash = await safe.installModule({
    type: 'executor',
    address: scheduledTransfersModuleAddress,
    context: scheduledTransfersModule.initData as `0x${string}`
  })

  console.log(
    'Scheduled transfers module is being installed: https://sepolia.etherscan.io/tx/' +
      txHash
  )

  return txHash
}

export const scheduleTransfer = async (
  safe: SafeSmartAccountClient,
  scheduledTransferInput: ScheduledTransferDataInput
) => {
  const { startDate, repeatEvery, numberOfRepeats, amount, recipient } =
    scheduledTransferInput
  const scheduledTransfer = {
    startDate,
    repeatEvery,
    numberOfRepeats,
    token: {
      token_address: sepoliaUSDCTokenAddress as `0x${string}`,
      decimals: 6
    },
    amount,
    recipient
  }

  const scheduledTransferData = getCreateScheduledTransferAction({
    scheduledTransfer
  })
  const txHash = await safe.sendTransaction({
    to: scheduledTransferData.target,
    value: scheduledTransferData.value as bigint,
    data: scheduledTransferData.callData
  })

  console.log(
    'Transfer is being scheduled: https://sepolia.etherscan.io/tx/' + txHash
  )
  return txHash
}

export const executeOrder = async (jobId: number) => {
  const executeTransfer = getExecuteScheduledTransferAction({ jobId })
  console.log(executeTransfer)
  return executeTransfer
}
