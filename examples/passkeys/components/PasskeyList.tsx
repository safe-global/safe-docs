import { useEffect, useState } from 'react'

import {
  createPasskey,
  loadPasskeysFromLocalStorage,
  storePasskeyInLocalStorage,
  type PasskeyItemType
} from '../lib/passkeys'

type Props = {
  selectPasskeySigner: (rawId: string) => void
}

function PasskeyList ({ selectPasskeySigner }: Props) {
  const [passkeyList, setPasskeyList] = useState<PasskeyItemType[]>([])

  async function handleSubmit () {
    const passkey = await createPasskey()
    storePasskeyInLocalStorage(passkey)
    refreshPasskeyList()
  }

  function refreshPasskeyList () {
    const passkeys = loadPasskeysFromLocalStorage()
    setPasskeyList(passkeys)
  }

  useEffect(() => {
    refreshPasskeyList()
  }, [])

  return (
    <>
      <h3>Create new Passkey</h3>
      <button onClick={handleSubmit}>Add New Passkey</button>{' '}
      {passkeyList.length > 0 && (
        <>
          <h2>Passkey List</h2>
          {passkeyList.map(passkey => (
            <div
              style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
              key={passkey.rawId}
            >
              Id: {passkey.rawId}{' '}
              <button onClick={() => selectPasskeySigner(passkey.rawId)}>
                Select
              </button>
            </div>
          ))}
        </>
      )}
    </>
  )
}

export default PasskeyList
