import dynamic from 'next/dynamic'
import Loader from '../Loader'

const ApiReference = dynamic(async () => await import('./ApiReference'), {
  loading: () => <Loader />
})

export default ApiReference
