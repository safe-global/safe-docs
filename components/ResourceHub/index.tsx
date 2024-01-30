import dynamic from 'next/dynamic'

const Projects = dynamic(async () => await import('./Resources'))

export default Projects
