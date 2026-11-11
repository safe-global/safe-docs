import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { HOST } from '../components/MetaTags'

// The docs start at /home; the meta refresh and the link get there without JavaScript.
const HOME = '/home'

const Index = (): React.ReactElement => {
  const router = useRouter()
  useEffect(() => {
    void router.replace(HOME)
  }, [router])
  return (
    <>
      <Head>
        <title>Safe Docs</title>
        <meta httpEquiv='refresh' content={`0; url=${HOME}`} />
        <link rel='canonical' href={`${HOST}${HOME}`} />
      </Head>
      <p>
        <Link href={HOME}>Go to the Safe Docs</Link>
      </p>
    </>
  )
}

export default Index
