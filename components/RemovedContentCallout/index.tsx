import { Callout } from 'nextra/components'
import { useEffect, useState } from 'react'

const RemovedContentCallout: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [isContentRemoved, setIsContentRemoved] = useState<boolean>(false)

  useEffect(() => {
    const urlParams = new URL(window.location.toString()).searchParams
    const isRemoved = urlParams.get('removed') === 'true'
    setIsContentRemoved(isRemoved)
  }, [])

  if (!isContentRemoved) return

  return <Callout type='warning'>{children}</Callout>
}

export default RemovedContentCallout
