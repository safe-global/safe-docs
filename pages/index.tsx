import { useEffect } from 'react'
import { useRouter } from 'next/router'

const RedirectIndex: React.FC = () => {
  const { push } = useRouter()

  useEffect(() => {
    void push('/what-is-safe')
  }, [push])

  return <></>
}

export default RedirectIndex
