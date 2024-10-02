import dynamic from 'next/dynamic'

const SupportedNetworksPage = dynamic(async () => await import('./Networks'))

export default SupportedNetworksPage
