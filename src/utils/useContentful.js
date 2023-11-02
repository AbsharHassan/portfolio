import { useState, useEffect } from 'react'
import { createClient } from 'contentful'

const useContentful = () => {
  const [contentfulFetchingData, setContentfulFetchingData] = useState(false)
  const [requestCount, setRequestCount] = useState(0)

  const client = createClient({
    space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
    accessToken: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN,
  })

  const incrementRequestCount = () => {
    setRequestCount((prevCount) => prevCount + 1)
  }

  const decrementRequestCount = () => {
    setRequestCount((prevCount) => prevCount - 1)
    if (requestCount === 1) {
    }
  }

  useEffect(() => {
    console.log(requestCount)
    setContentfulFetchingData(requestCount ? true : false)
  }, [requestCount])

  const getHero = async () => {
    try {
      incrementRequestCount()

      const data = await client.getEntries({
        content_type: 'hero',
        select: 'fields',
        order: 'sys.createdAt',
      })

      decrementRequestCount()
      return data
    } catch (error) {
      decrementRequestCount()
      console.log(error)
    }
  }

  const getProjects = async () => {
    try {
      incrementRequestCount()

      const data = await client.getEntries({
        content_type: 'project',
        select: 'fields',
        order: 'sys.createdAt',
      })

      decrementRequestCount()
      return data
    } catch (error) {
      decrementRequestCount()
      console.log(error)
    }
  }

  const getServices = async () => {
    try {
      incrementRequestCount()

      const data = await client.getEntries({
        content_type: 'service',
        select: 'fields',
        order: 'sys.createdAt',
      })

      decrementRequestCount()
      return data
    } catch (error) {
      decrementRequestCount()
      console.log(error)
    }
  }

  const getToolset = async () => {
    try {
      incrementRequestCount()

      const data = await client.getEntries({
        content_type: 'tool',
        select: 'fields',
        order: 'sys.createdAt',
      })

      decrementRequestCount()
      return data
    } catch (error) {
      decrementRequestCount()
      console.log(error)
    }
  }

  return {
    contentfulFetchingData,
    getHero,
    getProjects,
    getServices,
    getToolset,
  }
}

export default useContentful
