'use client'

import { useState } from 'react'
import { Safe4337Pack } from '@safe-global/relay-kit'
import Img from 'next/image'

import PasskeyList from '../components/PasskeyList'
import { executeUSDCTransfer } from '../lib/usdc'
import { getPasskeyFromRawId, type PasskeyArgType } from '../lib/passkeys'
import { BUNDLER_URL, CHAIN_NAME, RPC_URL } from '../lib/constants'
import { bufferToString } from '../lib/utils'

function Create4337SafeAccount () {
  const [selectedPasskey, setSelectedPasskey] = useState<PasskeyArgType>()
  const [safeAddress, setSafeAddress] = useState<string>()
  const [isSafeDeployed, setIsSafeDeployed] = useState<boolean>()
  const [userOp, setUserOp] = useState<string>()

  const selectPasskeySigner = async (rawId: string) => {
    console.log('selected passkey signer: ', rawId)

    const passkey = await getPasskeyFromRawId(rawId)

    const safe4337Pack = await Safe4337Pack.init({
      provider: RPC_URL,
      rpcUrl: RPC_URL,
      signer: passkey,
      bundlerUrl: BUNDLER_URL,
      options: {
        owners: [],
        threshold: 1
      }
    })

    const safeAddress = await safe4337Pack.protocolKit.getAddress()
    const isSafeDeployed = await safe4337Pack.protocolKit.isSafeDeployed()

    setSelectedPasskey(passkey)
    setSafeAddress(safeAddress)
    setIsSafeDeployed(isSafeDeployed)
  }

  return (
    <>
      <div
        style={{
          width: '50%'
        }}
      >
        {selectedPasskey && (
          <>
            <h2>Passkey Selected</h2>

            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {bufferToString(selectedPasskey.rawId)}
            </div>
          </>
        )}
        <PasskeyList selectPasskeySigner={selectPasskeySigner} />
      </div>
      {safeAddress && (
        <div
          style={{
            width: '50%'
          }}
        >
          <h2>Safe Account</h2>

          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Address: {safeAddress}
          </div>
          <div>
            Is deployed?:{' '}
            {isSafeDeployed ? (
              <a
                href={`https://app.safe.global/transactions/history?safe=sep:${safeAddress}`}
                target='_blank'
                rel='noreferrer'
              >
                Yes{' '}
                <Img
                  src='/external-link.svg'
                  alt='External link'
                  width={14}
                  height={14}
                />
              </a>
            ) : (
              'No'
            )}
          </div>
          <div>
            {' '}
            <a
              href='https://faucet.circle.com/'
              target='_blank'
              rel='noreferrer'
            >
              Get some test USDC for your Safe{' '}
              <Img
                src='/external-link.svg'
                alt='External link'
                width={14}
                height={14}
              />
            </a>
          </div>
          {selectedPasskey && (
            <button
              onClick={async () =>
                await executeUSDCTransfer({
                  signer: selectedPasskey,
                  safeAddress
                }).then(userOpHash => {
                  setUserOp(userOpHash)
                  setIsSafeDeployed(true)
                })
              }
            >
              Sign transaction with passkey
            </button>
          )}
          {userOp && isSafeDeployed && (
            <>
              <div>
                Done! Check the transaction status on{' '}
                <a
                  href={`https://jiffyscan.xyz/userOpHash/${userOp}?network=${CHAIN_NAME}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  Jiffy Scan{' '}
                  <Img
                    src='/external-link.svg'
                    alt='External link'
                    width={14}
                    height={14}
                  />
                </a>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default Create4337SafeAccount
