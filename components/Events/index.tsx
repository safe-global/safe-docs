import dynamic from 'next/dynamic'
import Loader from '../Loader'

const Events = dynamic(async () => await import('./Events'), {
  loading: () => <Loader />
})

export default Events
