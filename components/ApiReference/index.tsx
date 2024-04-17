import dynamic from 'next/dynamic'

const ApiReference = dynamic(async () => await import('./ApiReference'))

export default ApiReference
