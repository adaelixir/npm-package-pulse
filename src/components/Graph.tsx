import React, { useEffect, useState } from 'react'
import dependenciesList from '../../bin/dependenciesList.json'

function Graph() {
  const [data, setData] = useState<
    {
      packageName: string
      dependencies: string[]
      devDependencies: string[]
      numDependencies: number
    }[]
  >([])

  useEffect(() => {
    setData(dependenciesList)
  }, [])

  return (
    <div>
      <h1>Graph Component</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default Graph
