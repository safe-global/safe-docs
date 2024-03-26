import type { GetStaticProps } from 'next'

const RedirectIndex: React.FC = () => <></>

export default RedirectIndex

export const getStaticProps: GetStaticProps = async () => {
  return {
    redirect: {
      destination: '/home/what-is-safe',
      permanent: true
    }
  }
}
