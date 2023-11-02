import { createClient } from 'contentful'

const useContentful = () => {
  const client = createClient({
    space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
    accessToken: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN,
  })

  const getHero = async () => {
    try {
      const data = await client.getEntries({
        content_type: 'hero',
        select: 'fields',
        order: 'sys.createdAt',
      })
      return data
    } catch (error) {
      console.log(error)
    }
  }

  const getProjects = async () => {
    try {
      const data = await client.getEntries({
        content_type: 'project',
        select: 'fields',
        order: 'sys.createdAt',
      })
      return data
    } catch (error) {
      console.log(error)
    }
  }

  const getServices = async () => {
    try {
      const data = await client.getEntries({
        content_type: 'service',
        select: 'fields',
        order: 'sys.createdAt',
      })
      return data
    } catch (error) {
      console.log(error)
    }
  }

  const getToolset = async () => {
    try {
      const data = await client.getEntries({
        content_type: 'tool',
        select: 'fields',
        order: 'sys.createdAt',
      })
      return data
    } catch (error) {
      console.log(error)
    }
  }

  return { getHero, getProjects, getServices, getToolset }
}

export default useContentful
