import { useState, useEffect } from 'react'

import { SafeSmartAccountClient } from '@/lib/permissionless'
import {
  install7579Module,
  scheduleTransfer,
  scheduledTransfersModuleAddress
} from '@/lib/scheduledTransfers'

const ScheduledTransferForm: React.FC<{ safe: SafeSmartAccountClient }> = ({
  safe
}) => {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState(0)
  const [date, setDate] = useState('')
  const [txHash, setTxHash] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [is7579Installed, setIs7579Installed] = useState(false)

  useEffect(() => {
    const init7579Module = async () => {
      const isModuleInstalled = await safe
        .isModuleInstalled({
          type: 'executor',
          address: scheduledTransfersModuleAddress,
          context: '0x'
        })
        .catch(() => false)
      if (isModuleInstalled) {
        setIs7579Installed(true)
      }
    }
    void init7579Module()
  }, [safe])

  return (
    <>
      <div style={{ marginTop: '40px' }}>Your Safe: {safe.account.address}</div>{' '}
      <div style={{ marginTop: '10px' }}>
        ERC-7579 module installed:{' '}
        {is7579Installed
          ? 'Yes ✅'
          : 'No, schedule a transfer below to install it!'}{' '}
      </div>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '40px',
          marginBottom: '40px'
        }}
      >
        <div>
          <label htmlFor='address'>Address:</label>
          <input
            style={{ marginLeft: '20px' }}
            id='address'
            placeholder='0x...'
            onChange={e => setRecipient(e.target.value)}
            value={recipient}
          />
        </div>
        <div>
          <label htmlFor='amount'>Amount (integer):</label>
          <input
            style={{ marginLeft: '20px' }}
            id='amount'
            type='number'
            placeholder='1'
            min='0'
            onChange={e => setAmount(Number(e.target.value))}
            value={amount}
          />
        </div>
        <div>
          <label htmlFor='date'>Date/Time:</label>
          <input
            style={{ marginLeft: '20px' }}
            id='date'
            type='datetime-local'
            onChange={e => setDate(e.target.value)}
            value={date}
          />
        </div>

        <button
          disabled={!recipient || !amount || !date || loading}
          onClick={async () => {
            setLoading(true)
            setError(false)
            const startDate = new Date(date).getTime() / 1000
            const transferInputData = {
              startDate: 1710759572,
              repeatEvery: 60 * 60 * 24,
              numberOfRepeats: 1,
              amount,
              recipient: recipient as `0x${string}`
            }

            await (!is7579Installed ? install7579Module : scheduleTransfer)(
              safe,
              transferInputData
            )
              .then(txHash => {
                setTxHash(txHash)
                setLoading(false)
                setRecipient('')
                setAmount(0)
                setDate('')
                setIs7579Installed(true)
              })
              .catch(err => {
                console.error(err)
                setLoading(false)
                setError(true)
              })
          }}
        >
          Schedule Transfer
        </button>
      </div>
      <div>
        {loading ? <p>Processing, please wait...</p> : null}
        {error ? (
          <p>
            There was an error processing the transaction. Please try again.
          </p>
        ) : null}
        {txHash ? (
          <>
            <p>
              Success!{' '}
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target='_blank'
                rel='noreferrer'
                style={{
                  textDecoration: 'underline',
                  fontSize: '14px'
                }}
              >
                View on Etherscan
              </a>
            </p>
          </>
        ) : null}
      </div>
    </>
  )
}

export default ScheduledTransferForm
