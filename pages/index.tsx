import { useRouter } from 'next/router'
import { useEffect } from 'react'

const RedirectIndex: React.FC = () => {
  const { push } = useRouter()

  useEffect(() => {
    void push('/home/what-is-safe')
  }, [push])

  return <>Loading...</>
}

export default RedirectIndex
