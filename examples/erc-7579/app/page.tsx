'use client'

import { useEffect, useState } from 'react'

import {
  getSmartAccountClient,
  publicClient,
  type SafeSmartAccountClient
} from '../lib/permissionless'

import ScheduledTransferForm from '../components/ScheduledTransferForm'
import abi from '../abi/ScheduleTransfersModule.json'
import { scheduledTransfersModuleAddress } from '@/lib/scheduledTransfers'
import ScheduledTransfers from '@/components/ScheduledTransfers'
import ProcessedTransfers from '@/components/ProcessedTransfers'

export default function Home () {
  const [safe, setSafe] = useState<SafeSmartAccountClient | undefined>()
  const [logs, setLogs] = useState<any[]>([])

  const handleLoadSafe = async () => {
    const safe = await getSmartAccountClient()
    setSafe(safe)
  }

  useEffect(() => {
    const unwatch = publicClient.watchContractEvent({
      address: scheduledTransfersModuleAddress,
      abi,
      // eventName: 'ExecutionAdded', // Optional
      // args: { smartAccount: safe?.account.address }, // Optional
      onLogs: logs => {
        setLogs(_logs => [
          ..._logs,
          ...logs.filter(
            log =>
              !_logs.map(l => l.transactionHash).includes(log.transactionHash)
          )
        ])
      }
    })
    return () => unwatch()
    // }, [safe]) // Optional
  }, [])

  return (
    <>
      {safe == null ? (
        <>
          <button onClick={handleLoadSafe} style={{ marginTop: '40px' }}>
            Create Safe
          </button>
        </>
      ) : (
        <>
          <ScheduledTransferForm safe={safe} />
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <ScheduledTransfers transfers={logs} />
            <ProcessedTransfers transfers={logs} />
          </div>
        </>
      )}
    </>
  )
}
